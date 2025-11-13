import app from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log('🚀 ========================================');
      console.log(`🚀 Spark Investment Backend API`);
      console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🚀 API URL: http://localhost:${PORT}/api`);
      console.log(`🚀 Health Check: http://localhost:${PORT}/api/health`);
      console.log('🚀 ========================================');
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(async () => {
        await disconnectDatabase();
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT signal received: closing HTTP server');
      server.close(async () => {
        await disconnectDatabase();
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
