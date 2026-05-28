import app from './app';
import { env } from './config/env';
import { connectDB } from './config/database';

const startServer = async (): Promise<void> => {
  try {
    // Koneksi ke database
    await connectDB();

    // Jalankan server
    app.listen(env.port, () => {
      console.log(`🚀 Server berjalan di http://localhost:${env.port}`);
      console.log(`📌 Environment: ${env.nodeEnv}`);
      console.log(`🔗 API Base URL: http://localhost:${env.port}/api`);
    });
  } catch (error) {
    console.error('❌ Gagal menjalankan server:', error);
    process.exit(1);
  }
};

startServer();
