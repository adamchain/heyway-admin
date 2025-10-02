# GetHeyway Admin Dashboard

A production-ready admin dashboard for GetHeyway.com, designed for tracking user growth and handling customer service operations.

> **Production Ready**: All mock data has been removed and the application is configured for real production deployment.

## 🚀 Features

### 📊 **Dashboard & Analytics**
- Real-time user growth metrics and trends
- Revenue tracking and subscription analytics
- Call performance monitoring
- User retention analysis
- Interactive charts and visualizations

### 👥 **User Management**
- Comprehensive user directory with search and filtering
- User subscription status tracking
- Advanced pagination and sorting
- User activity monitoring

### 🎧 **Customer Service**
- Support ticket management system
- Ticket status tracking and assignment
- Customer satisfaction metrics
- Automated response time monitoring

### 🔍 **System Monitoring**
- Real-time system health monitoring
- Performance metrics (CPU, Memory, Disk)
- Network latency tracking
- Automated alert system
- System uptime monitoring

### 🔐 **Security & Authentication**
- Secure admin authentication
- Session management
- Protected routes
- Production-ready security headers

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Recharts, TanStack Table
- **Backend**: Node.js, Express, MongoDB
- **Styling**: Modern CSS with responsive design
- **Authentication**: Secure session-based auth
- **Monitoring**: Real-time system metrics
- **Deployment**: Docker, Nginx, CI/CD ready

## 🚀 Quick Start

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd admin-dashboard
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your MongoDB connection string
   ```

3. **Start the development server:**
   ```bash
   npm run server  # Backend on port 3001
   npm run dev     # Frontend on port 5173
   ```

4. **Access the dashboard:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3001/api](http://localhost:3001/api)

### Demo Credentials
- **Username**: `admin`
- **Password**: `getheyway2024`

## 🏗 Production Deployment

### Docker Deployment (Recommended)

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

2. **Access the application:**
   - HTTP: [http://localhost](http://localhost)
   - HTTPS: [https://admin.getheyway.com](https://admin.getheyway.com) (with SSL setup)

### Manual Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set production environment variables:**
   ```bash
   export NODE_ENV=production
   export MONGO_URI=your_production_mongodb_uri
   export PORT=3001
   ```

3. **Start the production server:**
   ```bash
   npm start
   ```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/getheyway` |
| `VITE_API_BASE_URL` | API base URL for frontend | `http://localhost:3001/api` |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `JWT_SECRET` | JWT secret key | Required for production |

### Production Checklist

Before deploying to production:

- [ ] Update `MONGO_URI` to your production MongoDB instance
- [ ] Set `NODE_ENV=production`
- [ ] Configure `JWT_SECRET` with a secure random string
- [ ] Update `VITE_API_BASE_URL` to your production API URL
- [ ] Set up SSL certificates for HTTPS
- [ ] Configure proper SMTP settings for email notifications
- [ ] Test all API endpoints with real data
- [ ] Verify authentication and authorization flows

## 📁 Project Structure

```
admin-dashboard/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── UserList.tsx     # User management
│   │   ├── CustomerService.tsx # Support tickets
│   │   ├── Analytics.tsx    # Analytics & insights
│   │   ├── Monitoring.tsx   # System monitoring
│   │   ├── Navigation.tsx   # Navigation bar
│   │   └── Auth.tsx         # Authentication
│   ├── services/            # API services
│   └── data/               # Mock data & types
├── server.ts               # Express server
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose setup
├── nginx.conf             # Nginx configuration
└── schemas-reference/     # Database schemas
```

## 🔧 Configuration

### MongoDB Collections
The dashboard connects to these MongoDB collections:
- `users` - User accounts and profiles
- `calls` - Call logs and metrics
- `subscriptions` - Subscription data
- `automations` - Automation configurations
- `feedbacks` - Customer feedback

### SSL Configuration
For production HTTPS setup:
1. Place SSL certificates in `./ssl/` directory
2. Update `nginx.conf` with correct certificate paths
3. Configure DNS to point to your server

## 🚀 CI/CD Pipeline

The project includes GitHub Actions workflow for automated deployment:
- Automated testing on pull requests
- Production deployment on main branch push
- Docker image building and deployment

## 📊 Monitoring & Alerts

### System Metrics
- CPU, Memory, and Disk usage
- Network latency monitoring
- Active connections tracking
- Error rate monitoring

### Alert System
- Real-time alert generation
- Configurable thresholds
- Alert resolution tracking
- Email notifications (configurable)

## 🔐 Security Features

- Secure authentication system
- Protected admin routes
- Rate limiting (configurable)
- Security headers
- Input validation
- SQL injection prevention

## 📈 Performance

- Optimized React components
- Efficient data fetching
- Responsive design
- Gzip compression
- Static file caching
- Database query optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is proprietary software for GetHeyway.com.

## 🆘 Support

For support and questions:
- Email: admin@getheyway.com
- Documentation: [Internal Wiki]
- Issues: [GitHub Issues]

---

**Built with ❤️ for GetHeyway.com**
