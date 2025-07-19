import React from 'react';
// import TopHeader from '../TopHeader/TopHeader';
// import Footer from '../Footer/Footer';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Sidebar from './components/Sidebar';

const summaryData = [
  {
    title: 'Total Students',
    value: '1,247',
    trend: '+12% from last month',
    icon: '👨‍🎓',
    colorClass: 'text-blue-500',
    trendPositive: true,
  },
  {
    title: 'Total Teachers',
    value: '89',
    trend: '+3 new this month',
    icon: '👩‍🏫',
    colorClass: 'text-green-500',
    trendPositive: true,
  },
  {
    title: 'Classes',
    value: '42',
    trend: 'Across 12 grades',
    icon: '🏫',
    colorClass: 'text-yellow-500',
    trendPositive: null,
  },
  {
    title: 'Revenue',
    value: '$89,432',
    trend: '+8% from last month',
    icon: '💰',
    colorClass: 'text-purple-500',
    trendPositive: true,
  },
];

const recentActivities = [
  {
    type: 'New student enrolled',
    detail: 'Sarah Johnson · Grade 10A',
    colorClass: 'text-blue-500',
    icon: '👨‍🎓',
  },
  {
    type: 'Attendance marked',
    detail: 'Grade 9B · 28/30 present',
    colorClass: 'text-green-500',
    icon: '✅',
  },
  {
    type: 'Fee payment reminder',
    detail: '15 students pending',
    colorClass: 'text-yellow-500',
    icon: '⚠️',
  },
];

const enrollmentData = [
  { name: 'Grade 9A', value: 120 },
  { name: 'Grade 9B', value: 98 },
  { name: 'Grade 10A', value: 150 },
  { name: 'Grade 10B', value: 130 },
  { name: 'Grade 11A', value: 80 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

const Dashboard = () => {
  return (
    <>
    {/* <TopHeader /> */}

    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-6">
        <div className="dashboard-header mb-6 border-b border-gray-700 pb-4 flex items-center space-x-4">
          <div className="h-1 w-16 bg-blue-500 rounded"></div>
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Welcome to our School ERP System</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {summaryData.map((item, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-md bg-gray-800 flex items-center space-x-4`}
            >
              <div className={`text-4xl ${item.colorClass}`}>{item.icon}</div>
              <div>
                <div className="text-2xl font-semibold">{item.value}</div>
                <div className="text-gray-300">{item.title}</div>
                <div
                  className={`mt-1 ${
                    item.trendPositive === true
                      ? 'text-green-400'
                      : item.trendPositive === false
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }`}
                >
                  {item.trend}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Student Enrollment Trend</h2>
            <PieChart width={400} height={300}>
              <Pie
                data={enrollmentData}
                cx={200}
                cy={150}
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {enrollmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          <div className="flex-1 bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className={`flex items-center space-x-4 mb-4 ${activity.colorClass}`}
              >
                <div className="text-3xl">{activity.icon}</div>
                <div>
                  <div className="font-semibold">{activity.type}</div>
                  <div className="text-gray-300">{activity.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* <Footer /> */}
    </>
  );
};

export default Dashboard;
