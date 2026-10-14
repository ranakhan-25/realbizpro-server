import { execSync } from 'child_process';
import * as XLSX from 'xlsx';
import * as path from 'path';

interface CommitReport {
  SL: number;
  Date: string;
  Time: string;
  Project: string;
  Branch: string;
  CommitHash: string;
  AuthorName: string;
  AuthorEmail: string;
  CommitMessage: string;
  FilesChanged: number;
  Insertions: number;
  Deletions: number;
  JiraIssueKey: string;
  Sprint: string;
  Status: string;
}

function runCommand(command: string): string {
  try {
    return execSync(command, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 50 * 1024 * 1024,
    }).trim();
  } catch (error: any) {
    console.error(`Command failed: ${command}`);
    console.error(error?.stderr?.toString() || error.message);
    return '';
  }
}

function getGitEmail(): string {
  const email = runCommand('git config user.email');

  if (!email) {
    throw new Error(
      'Git email পাওয়া যায়নি। আগে চালান: git config user.email "your-email@gmail.com"',
    );
  }

  return email;
}

function getProjectName(): string {
  const rootPath = runCommand('git rev-parse --show-toplevel');
  return rootPath ? path.basename(rootPath) : 'Unknown Project';
}

function getCurrentBranch(): string {
  return runCommand('git branch --show-current') || 'Unknown';
}

function extractJiraIssueKey(message: string): string {
  const match = message.match(/\b[A-Z][A-Z0-9]+-\d+\b/);
  return match ? match[0] : '';
}

function getCommitStats(commitHash: string): {
  filesChanged: number;
  insertions: number;
  deletions: number;
} {
  const output = runCommand(
    `git show --shortstat --format="" ${commitHash}`,
  );

  const filesMatch = output.match(/(\d+) files? changed/);
  const insertionsMatch = output.match(/(\d+) insertions?\(\+\)/);
  const deletionsMatch = output.match(/(\d+) deletions?\(-\)/);

  return {
    filesChanged: filesMatch ? Number(filesMatch[1]) : 0,
    insertions: insertionsMatch ? Number(insertionsMatch[1]) : 0,
    deletions: deletionsMatch ? Number(deletionsMatch[1]) : 0,
  };
}

function generateReport(): void {
  const gitEmail = getGitEmail();
  const projectName = getProjectName();
  const currentBranch = getCurrentBranch();

  console.log(`Git email: ${gitEmail}`);
  console.log(`Project: ${projectName}`);
  console.log('Commit report তৈরি হচ্ছে...');

  const separator = '__GIT_REPORT_SEPARATOR__';

  const gitLog = runCommand(
    `git log --all --author="${gitEmail}" ` +
      `--pretty=format:"%H${separator}%an${separator}%ae${separator}%ad${separator}%s" ` +
      `--date=format:"%Y-%m-%d %H:%M:%S"`,
  );

  if (!gitLog) {
    console.log(`এই email দিয়ে কোনো commit পাওয়া যায়নি: ${gitEmail}`);
    return;
  }

  const rows: CommitReport[] = gitLog
    .split('\n')
    .filter(Boolean)
    .map((line, index) => {
      const [
        commitHash,
        authorName,
        authorEmail,
        dateTime,
        commitMessage,
      ] = line.split(separator);

      const [date = '', time = ''] = dateTime.split(' ');
      const stats = getCommitStats(commitHash);

      return {
        SL: index + 1,
        Date: date,
        Time: time,
        Project: projectName,
        Branch: currentBranch,
        CommitHash: commitHash.substring(0, 10),
        AuthorName: authorName,
        AuthorEmail: authorEmail,
        CommitMessage: commitMessage,
        FilesChanged: stats.filesChanged,
        Insertions: stats.insertions,
        Deletions: stats.deletions,
        JiraIssueKey: extractJiraIssueKey(commitMessage),
        Sprint: '',
        Status: 'Done',
      };
    });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 12 },
    { wch: 10 },
    { wch: 25 },
    { wch: 18 },
    { wch: 14 },
    { wch: 24 },
    { wch: 32 },
    { wch: 65 },
    { wch: 14 },
    { wch: 12 },
    { wch: 12 },
    { wch: 16 },
    { wch: 18 },
    { wch: 12 },
  ];

  worksheet['!autofilter'] = {
    ref: worksheet['!ref'] || 'A1:O1',
  };

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Git Commit Report',
  );

  const safeEmail = gitEmail.replace(/[^a-zA-Z0-9]/g, '_');
  const today = new Date().toISOString().slice(0, 10);

  const fileName = `git-commit-report-${safeEmail}-${today}.xlsx`;
  const outputPath = path.resolve(process.cwd(), fileName);

  XLSX.writeFile(workbook, outputPath);

  console.log('');
  console.log('✅ Excel report তৈরি হয়েছে');
  console.log(`📊 Total commits: ${rows.length}`);
  console.log(`📁 File: ${outputPath}`);
}

generateReport();