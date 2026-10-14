import path from 'node:path';
import Module from 'node:module';

const aliasTargets: Array<[string, string]> = [
  [
    '@/database',
    path.join(__dirname, 'database'),
  ],
  ['@/modules', path.join(__dirname, 'modules')],
  ['@/common', path.join(__dirname, 'common')],
  ['@/config', path.join(__dirname, 'config')],
  ['@', __dirname],
];

const moduleLoader = Module as any;
const originalResolveFilename =
  moduleLoader._resolveFilename as (
    request: string,
    parent: NodeModule | null,
    isMain: boolean,
    options: unknown,
  ) => string;

moduleLoader._resolveFilename = function (
  request: string,
  parent: NodeModule | null,
  isMain: boolean,
  options: unknown,
) {
  for (const [alias, target] of aliasTargets) {
    if (request === alias) {
      request = target;
      break;
    }

    if (request.startsWith(`${alias}/`)) {
      request = path.join(
        target,
        request.slice(alias.length + 1),
      );
      break;
    }
  }

  return originalResolveFilename.call(
    this,
    request,
    parent,
    isMain,
    options,
  );
};
