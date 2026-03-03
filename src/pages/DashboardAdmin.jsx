// src/pages/DashboardAdmin.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../api";

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    users: 0,
    properties: 0,
    rooms: 0,
    bookings: 0,
    activeUsers: 0,
    availableRooms: 0,
    pendingBookings: 0,
    recentBookings: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ดึงข้อมูลพร้อมกันเพื่อประสิทธิภาพที่ดีขึ้น
        const [usersRes, propertiesRes, roomsRes, bookingsRes, activitiesRes] =
          await Promise.all([
            API.get("/users"),
            API.get("/properties"),
            API.get("/rooms"),
            API.get("/bookings"),
            API.get("/activity?limit=10"),
          ]);

        // คำนวณสถิติเพิ่มเติม
        const activeUsers = usersRes.data.filter(
          (user) => user.status === "active"
        ).length;

        // คำนวณห้องว่าง (ห้องที่ไม่มีการจองที่ยืนยันแล้ว)
        const bookedRoomIds = bookingsRes.data
          .filter(
            (booking) =>
              booking.booking_status === "confirmed" || booking.booking_status === "pending"
          )
          .map((booking) => booking.room_id);

        const availableRooms = roomsRes.data.filter(
          (room) => !bookedRoomIds.includes(room.id)
        ).length;

        const pendingBookings = bookingsRes.data.filter(
          (booking) => booking.booking_status === "pending"
        ).length;
        const recentBookings = bookingsRes.data.filter((booking) => {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return new Date(booking.created_at) > oneWeekAgo;
        }).length;

        setStats({
          users: usersRes.data.length,
          properties: propertiesRes.data.length,
          rooms: roomsRes.data.length,
          bookings: bookingsRes.data.length,
          activeUsers,
          availableRooms,
          pendingBookings,
          recentBookings,
        });

        setRecentActivities(activitiesRes.data);
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบไทย
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return "เมื่อสักครู่";
    if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;
    if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;
    if (diffInDays < 7) return `${diffInDays} วันที่แล้ว`;

    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ฟังก์ชันสำหรับเลือกไอคอนตามประเภทกิจกรรม
  const getActivityIcon = (action) => {
    switch (action) {
      case "booking":
        return "fas fa-calendar-plus text-blue-500";
      case "cancel_booking":
        return "fas fa-calendar-times text-red-500";
      case "checkin":
        return "fas fa-sign-in-alt text-green-500";
      case "checkout":
        return "fas fa-sign-out-alt text-yellow-500";
      case "payment":
        return "fas fa-money-bill-wave text-green-600";
      case "create_property":
      case "create_room":
      case "create_user":
      case "add_tenant":
      case "create_maintenance":
        return "fas fa-plus-circle text-green-500";
      case "update_property":
      case "update_room":
      case "update_user":
      case "edit_property":
        return "fas fa-edit text-blue-500";
      case "delete_property":
      case "delete_room":
      case "delete_user":
        return "fas fa-trash-alt text-red-500";
      default:
        return "fas fa-info-circle text-gray-500";
    }
  };

  const statCards = [
    {
      title: "ผู้ใช้งาน",
      value: stats.users,
      subValue: `${stats.activeUsers} ใช้งานอยู่`,
      icon: "fas fa-users",
      gradient: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      hoverEffect: "hover:shadow-blue-200",
      path: "/admin/users",
    },
    {
      title: "อสังหาริมทรัพย์",
      value: stats.properties,
      icon: "fas fa-building",
      gradient: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      hoverEffect: "hover:shadow-green-200",
      path: "/admin/properties",
    },
    {
      title: "ห้องพัก",
      value: stats.rooms,
      subValue: `${stats.availableRooms} ว่าง`,
      icon: "fas fa-door-open",
      gradient: "from-yellow-400 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      hoverEffect: "hover:shadow-yellow-200",
      path: "/admin/rooms",
    },
    {
      title: "รายการจอง",
      value: stats.bookings,
      subValue: `${stats.pendingBookings} รอดำเนินการ`,
      icon: "fas fa-calendar-check",
      gradient: "from-red-400 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      hoverEffect: "hover:shadow-red-200",
      path: "/admin/bookings",
    },
  ];

  return (
    <Layout role="admin" showFooter={false} showNav={false}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 md:p-6">
        {/* Header with gradient text */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-kanit mb-2">
            <span className="gradient-text">Yo, Admin Zone Unlocked!</span>
            <span className="text-gray-800">🚀</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            แดชบอร์ดสำหรับผู้ดูแลระบบ แสดงข้อมูลสรุปทั้งหมดในระบบ Stayflow
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-exclamation-circle text-red-500"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-10 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <Link
                key={index}
                to={stat.path}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-2 ${stat.hoverEffect} hover:shadow-xl group cursor-pointer`}
              >
                <div className={`h-2 bg-gradient-to-r ${stat.gradient}`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <i
                        className={`${stat.icon} ${stat.textColor} text-xl`}
                      ></i>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {stat.title}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold font-kanit">
                        {stat.value}
                      </p>
                      {stat.subValue && (
                        <p className="text-gray-500 text-sm mt-1">
                          {stat.subValue}
                        </p>
                      )}
                    </div>
                    <div className="mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                        <i className="fas fa-arrow-right text-indigo-500 group-hover:translate-x-1 transition-transform duration-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Additional Dashboard Elements */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-kanit">การทำงานในระบบ</h2>
              <Link
                to="/admin/activitylist"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                ดูทั้งหมด <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>
            <div className="space-y-4">
              {loading ? (
                // Loading state for activities
                [...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-start p-3 animate-pulse"
                  >
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    </div>
                    <div className="flex-1">
                      <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))
              ) : recentActivities.length > 0 ? (
                // Display actual activities (only the first 5)
                recentActivities.slice(0, 5).map((activity, index) => (
                  <div
                    key={activity.id || index}
                    className="flex items-start p-3 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                        <i className={getActivityIcon(activity.action)}></i>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">
                        {/* <span className="font-medium">
                          {activity.user_fullname}
                        </span>{" "} */}
                        {activity.description || activity.action}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateTime(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                // Empty state
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-history text-indigo-500 text-2xl"></i>
                  </div>
                  <p className="text-gray-500">ไม่มีกิจกรรมล่าสุด</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold font-kanit mb-6">การกระทำด่วน</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: "fas fa-user-plus",
                  label: "เพิ่มผู้ใช้",
                  color: "from-blue-500 to-blue-600",
                  path: "/admin/users/?add=true",
                },
                {
                  icon: "fas fa-building",
                  label: "เพิ่มอสังหาริมทรัพย์",
                  color: "from-green-500 to-green-600",
                  path: "/admin/properties/?add=true",
                },
                {
                  icon: "fas fa-door-closed",
                  label: "เพิ่มห้องพัก",
                  color: "from-yellow-500 to-yellow-600",
                  path: "/admin/rooms",
                },
                {
                  icon: "fas fa-chart-line",
                  label: "รายการเช่า",
                  color: "from-purple-500 to-purple-600",
                  path: "/admin/bookings",
                },
              ].map((action, index) => (
                <Link
                  key={index}
                  to={action.path}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 group cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <i className={`${action.icon} text-white text-lg`}></i>
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Additional Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                ข้อมูลเพิ่มเติม
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 rounded-lg p-3">
                  <p className="text-sm text-indigo-600 font-medium">
                    ผู้ใช้ใหม่ (7 วัน)
                  </p>
                  <p className="text-xl font-bold text-indigo-800">
                    {stats.recentBookings}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-600 font-medium">
                    การจองใหม่ (7 วัน)
                  </p>
                  <p className="text-xl font-bold text-green-800">
                    {stats.recentBookings}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold font-kanit mb-2">สถานะระบบ</h3>
              <p className="text-indigo-100">ระบบทำงานปกติทุกอย่าง</p>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-400 mr-2 animate-pulse"></div>
              <span className="font-medium">ออนไลน์</span>
              <span className="mx-2">•</span>
              <span className="text-indigo-200">
                อัปเดตล่าสุด: {new Date().toLocaleTimeString("th-TH")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardAdmin;
