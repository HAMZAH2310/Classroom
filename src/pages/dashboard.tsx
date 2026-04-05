import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BACKEND_BASE_URL } from "@/constants";
import { DashboardStats, ActivityItem, ChartDataItem } from "@/types";
import { useEffect, useState } from "react";
import {
    AreaChart, Area,
    BarChart, Bar,
    PieChart, Pie, Cell,
    ResponsiveContainer,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import {
    Users, GraduationCap, BookOpen, Building2,
    TrendingUp, Activity, UserCheck
} from "lucide-react";

const CHART_COLORS = [
    'oklch(0.65 0.18 288)',
    'oklch(0.70 0.16 250)',
    'oklch(0.60 0.20 200)',
    'oklch(0.75 0.12 150)',
    'oklch(0.55 0.22 320)',
];

const CAPACITY_COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444'];

const Dashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [enrollmentTrends, setEnrollmentTrends] = useState<ChartDataItem[]>([]);
    const [classesByDept, setClassesByDept] = useState<ChartDataItem[]>([]);
    const [capacityStatus, setCapacityStatus] = useState<ChartDataItem[]>([]);
    const [userDistribution, setUserDistribution] = useState<ChartDataItem[]>([]);
    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [statsRes, trendsRes, deptRes, capRes, userRes, actRes] = await Promise.all([
                    fetch(`${BACKEND_BASE_URL}/api/dashboard/stats`),
                    fetch(`${BACKEND_BASE_URL}/api/dashboard/charts/enrollment-trends`),
                    fetch(`${BACKEND_BASE_URL}/api/dashboard/charts/classes-by-department`),
                    fetch(`${BACKEND_BASE_URL}/api/dashboard/charts/capacity-status`),
                    fetch(`${BACKEND_BASE_URL}/api/dashboard/charts/user-distribution`),
                    fetch(`${BACKEND_BASE_URL}/api/dashboard/activity`),
                ]);

                const [statsData, trendsData, deptData, capData, userData, actData] = await Promise.all([
                    statsRes.json(), trendsRes.json(), deptRes.json(),
                    capRes.json(), userRes.json(), actRes.json(),
                ]);

                setStats(statsData.data);
                setEnrollmentTrends(trendsData.data || []);
                setClassesByDept(deptData.data || []);
                setCapacityStatus(capData.data || []);
                setUserDistribution(userData.data || []);
                setActivity(actData.data || []);
            } catch (e) {
                console.error('Dashboard fetch error:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-page">
                <h1 className="page-title">Dashboard</h1>
                <p className="text-muted-foreground">Loading dashboard data...</p>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Active Classes', value: stats?.activeClasses ?? 0, icon: GraduationCap, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Subjects', value: stats?.totalSubjects ?? 0, icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { label: 'Departments', value: stats?.totalDepartments ?? 0, icon: Building2, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { label: 'Enrollments', value: stats?.totalEnrollments ?? 0, icon: UserCheck, color: 'text-pink-500', bg: 'bg-pink-500/10' },
        { label: 'All Classes', value: stats?.totalClasses ?? 0, icon: TrendingUp, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    ];

    return (
        <div className="dashboard-page">
            <h1 className="page-title">Dashboard</h1>
            <p className="into-row text-muted-foreground mb-6">Overview of your classroom management system.</p>

            {/* Stat Cards */}
            <div className="stat-cards-grid">
                {statCards.map((card) => (
                    <Card key={card.label} className="stat-card border-none shadow-lg bg-card/50 backdrop-blur-sm ring-1 ring-white/10">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{card.label}</p>
                                    <p className="text-3xl font-bold mt-1">{card.value}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${card.bg}`}>
                                    <card.icon className={`w-6 h-6 ${card.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="charts-grid">
                {/* Enrollment Trends */}
                <Card className="chart-card border-none shadow-lg bg-card/50 backdrop-blur-sm ring-1 ring-white/10 col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            Enrollment Trends
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={enrollmentTrends}>
                                <defs>
                                    <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="oklch(0.65 0.18 288)" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="oklch(0.65 0.18 288)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                                <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        fontSize: '13px'
                                    }}
                                />
                                <Area type="monotone" dataKey="count" stroke="oklch(0.65 0.18 288)" fill="url(#colorEnroll)" strokeWidth={2} name="Enrollments" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* User Distribution */}
                <Card className="chart-card border-none shadow-lg bg-card/50 backdrop-blur-sm ring-1 ring-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            User Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={userDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    dataKey="count"
                                    nameKey="role"
                                    label={({ role, count }) => `${role}: ${count}`}
                                >
                                    {userDistribution.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="charts-grid">
                {/* Classes by Department */}
                <Card className="chart-card border-none shadow-lg bg-card/50 backdrop-blur-sm ring-1 ring-white/10 col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-primary" />
                            Classes by Department
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={classesByDept}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="department" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" angle={-20} textAnchor="end" height={60} />
                                <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Bar dataKey="count" fill="oklch(0.65 0.18 288)" radius={[6, 6, 0, 0]} name="Classes" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Capacity Status */}
                <Card className="chart-card border-none shadow-lg bg-card/50 backdrop-blur-sm ring-1 ring-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-primary" />
                            Capacity Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={capacityStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    dataKey="count"
                                    nameKey="status"
                                    label={({ count }) => `${count}`}
                                >
                                    {capacityStatus.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={CAPACITY_COLORS[index % CAPACITY_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Feed */}
            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm ring-1 ring-white/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {activity.length > 0 ? (
                            activity.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-white/5">
                                    <div className={`p-2 rounded-lg ${item.type === 'enrollment' ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
                                        {item.type === 'enrollment' ? (
                                            <UserCheck className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <GraduationCap className="w-4 h-4 text-blue-500" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{item.description}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {item.type === 'enrollment' ? 'Enrollment' : 'New Class'}
                                    </Badge>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-6">No recent activity.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Dashboard