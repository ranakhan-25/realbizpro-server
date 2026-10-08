import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ReportService } from './src/modules/report/sales/report.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const reportService = app.get(ReportService);
  
  try {
    const filters = {
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      showroomId: 1
    };
    const buffer = await reportService.generate({
      reportName: 'sales-ledger-detail',
      type: 'pdf',
      filters,
    });
    console.log('PDF generated successfully, size:', buffer.length);
  } catch (err) {
    console.error('Error generating PDF:', err);
  }
  await app.close();
}
bootstrap();
