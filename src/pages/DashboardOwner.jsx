// DashboardOwner.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../api";

const DashboardOwner = () => {
  const [stats, setStats] = useState({
    properties: 0,
    rooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    maintenanceRooms: 0,
    bookings: 0,
    pendingBookings: 0,
  });
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = localStorage.getItem("role"); // 👈 owner หรือ staff
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ดึงข้อมูลพร้อมกัน
        const [
          propertiesRes,
          roomsRes,
          bookingsRes,
          staffRes,
          tenantRes,
          packageRes,
        ] = await Promise.all([
          API.get("/properties/my"),
          API.get("/rooms/my"),
          API.get("/bookings/my"),
          API.get("/staff/my"),
          API.get("/tenants"),
          API.get("/packages"),
        ]);

        const propertiesData = propertiesRes.data;
        const roomsData = roomsRes.data;
        const bookingsData = bookingsRes.data;
        const staffData = staffRes.data;
        const tenantData = tenantRes.data;
        const packageData = packageRes.data;

        // นับจำนวนห้องตาม status ที่ Backend ส่งมา
        let availableRooms = 0;
        let occupiedRooms = 0;
        let maintenanceRooms = 0;

        roomsData.forEach((room) => {
          switch (room.status) {
            case "available":
              availableRooms++;
              break;
            case "occupied":
              occupiedRooms++;
              break;
            case "maintenance":
            case "occupied_maintenance":
              maintenanceRooms++;
              break;
          }
        });

        const pendingBookings = bookingsData.filter(
          (booking) => booking.booking_status === "pending"
        ).length;

        setStats({
          properties: propertiesData.length,
          rooms: roomsData.length,
          availableRooms,
          occupiedRooms,
          maintenanceRooms,
          bookings: bookingsData.length,
          pendingBookings,
          staffAll: staffData.length,
          TenantAll: tenantData.length,
          packageAll: packageData.length,
        });

        setProperties(propertiesData);
        setRooms(roomsData);

        // เรียงลำดับการเช่าล่าสุด (5 รายการ)
        const sortedBookings = [...bookingsData].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setRecentBookings(sortedBookings.slice(0, 5));
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
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ฟังก์ชันสำหรับแปลงสถานะการเช่าเป็นข้อความ
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "รอดำเนินการ";
      case "confirmed":
        return "ยืนยันแล้ว";
      case "cancelled":
        return "ยกเลิกแล้ว";
      case "completed":
        return "เสร็จสิ้น";
      default:
        return status;
    }
  };

  // ฟังก์ชันสำหรับเลือกสีตามสถานะการเช่า
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statCards = [
    role === "owner" && {
      // 👈 ถ้า owner แสดงอสังหาริมทรัพย์ ห้องพัก รายการเช่า และพนักงาน
      title: "อสังหาริมทรัพย์",
      value: stats.properties,
      icon: "fas fa-building",
      gradient: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      hoverEffect: "hover:shadow-green-200",
      path: "/owner/properties",
    },
    role === "staff" || role === "owner"
      ? {
          title: "ห้องพัก",
          value: stats.rooms,
          subValue: `${stats.availableRooms} ว่าง`,
          icon: "fas fa-door-open",
          gradient: "from-blue-400 to-blue-600",
          bgColor: "bg-blue-50",
          textColor: "text-blue-600",
          hoverEffect: "hover:shadow-blue-200",
          path: role === "staff" ? "/staff/rooms" : "/owner/rooms",
        }
      : null,
    role === "staff" || role === "owner"
      ? {
          title: "รายการเช่า",
          value: stats.bookings,
          subValue: `${stats.pendingBookings} รอดำเนินการ`,
          icon: "fas fa-calendar-check",
          gradient: "from-purple-400 to-purple-600",
          bgColor: "bg-purple-50",
          textColor: "text-purple-600",
          hoverEffect: "hover:shadow-purple-200",
          path: role === "staff" ? "/staff/bookings" : "/owner/bookings",
        }
      : null,
    role === "owner" && {
      title: "พนักงาน",
      value: stats.staffAll,
      subValue: "คน",
      path: "/owner/staff",
      icon: "fas fa-user-tie",
      gradient: "from-yellow-400 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      hoverEffect: "hover:shadow-yellow-200",
    },
    role === "staff" && {
      title: "ผู้เช่า",
      value: stats.TenantAll,
      subValue: "คน",
      path: "/staff/tenant",
      icon: "fas fa-users",
      gradient: "from-pink-400 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
      hoverEffect: "hover:shadow-pink-200",
    },
    role === "staff" && {
      title: "พัสดุ",
      value: stats.packageAll,
      subValue: "ชิ้น",
      path: "/staff/packages",
      icon: "fas fa-box",
      gradient: "from-orange-400 to-orange-600",
      bgColor: "bg-pink-50",
      textColor: "text-orange-600",
      hoverEffect: "hover:shadow-orange-200",
    },
  ].filter(Boolean); // 👈 ลบ null ออก

  const roomStatusCards = [
    {
      title: "ห้องว่าง",
      value: stats.availableRooms,
      icon: "fas fa-door-open",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "ห้องไม่ว่าง",
      value: stats.occupiedRooms,
      icon: "fas fa-user",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      title: "ห้องซ่อมแซม",
      value: stats.maintenanceRooms,
      icon: "fas fa-tools",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
  ];

  return (
    <Layout role="owner" showFooter={false} showNav={false}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 md:p-6">
        {/* Header with gradient text */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-kanit mb-2 flex items-center justify-center gap-2">
            <span className="gradient-text">Hey Owners & Crew!</span>
            <span className="text-gray-800">🏠✨</span>
            <span className="gradient-text">Your Prop Hub</span>
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto">
            แดชบอร์ดสำหรับเจ้าของและพนักงาน
            แสดงข้อมูลสรุปอสังหาริมทรัพย์และห้องพักของคุณ
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

        {/* Room Status Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-10 w-24 bg-gray-200 rounded mb-2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {roomStatusCards.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bgColor}`}
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
                      <p className="text-gray-500 text-sm mt-1">ห้อง</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Additional Dashboard Elements */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-kanit">การเช่าล่าสุด</h2>
              <Link
                to={role === "owner" ? "/owner/bookings" : "/staff/bookings"}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                ดูทั้งหมด <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>
            <div className="space-y-4">
              {loading ? (
                // Loading state for bookings
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
              ) : recentBookings.length > 0 ? (
                // Display actual bookings
                recentBookings.map((booking, index) => (
                  <div
                    key={booking.id || index}
                    className="flex items-start p-3 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                        <i className="fas fa-calendar-check text-indigo-500"></i>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">
                        <span className="font-medium">
                          {booking.room_name || `ห้อง ${booking.room_code}`}
                        </span>{" "}
                        โดย {booking.fullname || booking.username}
                      </p>
                      <div className="flex items-center mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                            booking.booking_status
                          )}`}
                        >
                          {getStatusText(booking.booking_status)}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatDateTime(booking.booking_created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Empty state
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-calendar-times text-indigo-500 text-2xl"></i>
                  </div>
                  <p className="text-gray-500">ไม่มีการเช่าล่าสุด</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold font-kanit mb-6">การกระทำด่วน</h2>
            {/* Quick Actions Card */}
            <div className="grid grid-cols-2 gap-4">
              {(role === "owner"
                ? [
                    {
                      icon: "fas fa-building",
                      label: "เพิ่มอสังหาริมทรัพย์",
                      color: "from-green-500 to-green-600",
                      path: "/owner/properties/?add=true",
                    },
                    {
                      icon: "fas fa-door-closed",
                      label: "เพิ่มห้องพัก",
                      color: "from-blue-500 to-blue-600",
                      path: "/owner/rooms/?add=true",
                    },
                    {
                      icon: "fas fa-user-tie",
                      label: "เพิ่มพนักงาน",
                      color: "from-yellow-500 to-yellow-600",
                      path: "/owner/staff?add=true",
                    },
                    {
                      icon: "fas fa-user-plus",
                      label: "เพิ่มผู้เช่า",
                      color: "from-purple-500 to-purple-600",
                      path: "/owner/tenant?add",
                    },
                  ]
                : role === "staff"
                ? [
                    {
                      icon: "fas fa-door-closed",
                      label: "เพิ่มห้องพัก",
                      color: "from-blue-500 to-blue-600",
                      path: "/staff/rooms",
                    },
                    {
                      icon: "fas fa-user-plus",
                      label: "เพิ่มผู้เช่า",
                      color: "from-purple-500 to-purple-600",
                      path: "/staff/tenant?add",
                    },
                    {
                      icon: "fas fa-tools",
                      label: "การแจ้งซ่อม",
                      color: "from-red-500 to-red-600",
                      path: "/staff/maintenance?add=true",
                    },
                    {
                      icon: "fas fa-box-open",
                      label: "การแจ้งพัสดุ",
                      color: "from-blue-500 to-blue-700",
                      path: "/staff/packages?add=true",
                    },
                  ]
                : []
              ) // ถ้า role อื่นๆ ก็ไม่ต้องมี quick action
                .map((action, index) => (
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

            {/* Properties List */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                อสังหาริมทรัพย์ของคุณ
              </h3>
              <div className="space-y-3">
                {loading ? (
                  [...Array(2)].map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 animate-pulse"
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="h-4 w-3/4 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))
                ) : properties.length > 0 ? (
                  properties.slice(0, 3).map((property) => (
                    <Link
                      key={property.id}
                      to={`/owner/properties/${property.id}`}
                      className="flex items-center p-3 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center mr-3">
                        <i className="fas fa-building text-green-600"></i>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {property.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-xs">
                          {property.address}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {
                          rooms.filter(
                            (room) => room.property_id === property.id
                          ).length
                        }{" "}
                        ห้อง
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">ไม่มีอสังหาริมทรัพย์</p>
                  </div>
                )}
                {properties.length > 3 && (
                  <Link
                    to="/owner/properties"
                    className="block text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-2"
                  >
                    ดูทั้งหมด <i className="fas fa-arrow-right ml-1"></i>
                  </Link>
                )}
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

export default DashboardOwner;
