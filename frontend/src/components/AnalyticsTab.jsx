// import { motion } from "framer-motion";
// import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
// import { useEffect, useState } from "react";
// import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
// import axios from "../lib/axios";

// const AnalyticsTab = () => {
// 	const [analyticsData, setAnalyticsData] = useState({
// 		users: 0,
// 		products: 0,
// 		totalSales: 0,
// 		totalRevenue: 0,
// 	});
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [dailySalesData, setDailySalesData] = useState([]);

// 	useEffect(() => {
// 		const fetchAnalyticsData = async () => {
// 			try {
// 				const response = await axios.get("/analytics");
// 				setAnalyticsData(response.data.analyticsData);
// 				setDailySalesData(response.data.dailySalesData);
// 			} catch (error) {
// 				console.error("Error fetching analytics data:", error);
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		};

// 		fetchAnalyticsData();
// 	}, []);

// 	if (isLoading) {
// 		return <div>Loading...</div>;
// 	}

// 	return (
// 		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
// 			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
// 				<AnalyticsCard
// 					title='Total Users'
// 					value={analyticsData.users.toLocaleString()}
// 					icon={Users}
// 					color='from-emerald-500 to-teal-700'
// 				/>
// 				<AnalyticsCard
// 					title='Total Products'
// 					value={analyticsData.products.toLocaleString()}
// 					icon={Package}
// 					color='from-emerald-500 to-green-700'
// 				/>
// 				<AnalyticsCard
// 					title='Total Sales'
// 					value={analyticsData.totalSales.toLocaleString()}
// 					icon={ShoppingCart}
// 					color='from-emerald-500 to-cyan-700'
// 				/>
// 				<AnalyticsCard
// 					title='Total Revenue'
// 					value={`₹${analyticsData.totalRevenue.toLocaleString()}`}
// 					icon={DollarSign}
// 					color='from-emerald-500 to-lime-700'
// 				/>
// 			</div>
// 			<motion.div
// 				className='bg-gray-800/60 rounded-lg p-6 shadow-lg'
// 				initial={{ opacity: 0, y: 20 }}
// 				animate={{ opacity: 1, y: 0 }}
// 				transition={{ duration: 0.5, delay: 0.25 }}
// 			>
// 				<ResponsiveContainer width='100%' height={400}>
// 					<LineChart data={dailySalesData}>
// 						<CartesianGrid strokeDasharray='3 3' />
// 						<XAxis dataKey='name' stroke='#D1D5DB' />
// 						<YAxis yAxisId='left' stroke='#D1D5DB' />
// 						<YAxis yAxisId='right' orientation='right' stroke='#D1D5DB' />
// 						<Tooltip />
// 						<Legend />
// 						<Line
// 							yAxisId='left'
// 							type='monotone'
// 							dataKey='sales'
// 							stroke='#10B981'
// 							activeDot={{ r: 8 }}
// 							name='Sales'
// 						/>
// 						<Line
// 							yAxisId='right'
// 							type='monotone'
// 							dataKey='revenue'
// 							stroke='#3B82F6'
// 							activeDot={{ r: 8 }}
// 							name='Revenue'
// 						/>
// 					</LineChart>
// 				</ResponsiveContainer>
// 			</motion.div>
// 		</div>
// 	);
// };
// export default AnalyticsTab;

// const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
// 	<motion.div
// 		className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
// 		initial={{ opacity: 0, y: 20 }}
// 		animate={{ opacity: 1, y: 0 }}
// 		transition={{ duration: 0.5 }}
// 	>
// 		<div className='flex justify-between items-center'>
// 			<div className='z-10'>
// 				<p className='text-emerald-300 text-sm mb-1 font-semibold'>{title}</p>
// 				<h3 className='text-white text-3xl font-bold'>{value}</h3>
// 			</div>
// 		</div>
// 		<div className='absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30' />
// 		<div className='absolute -bottom-4 -right-4 text-emerald-800 opacity-50'>
// 			<Icon className='h-32 w-32' />
// 		</div>
// 	</motion.div>
// );







import { motion } from "framer-motion";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import axios from "../lib/axios"; // Import your configured axios instance

const AnalyticsTab = () => {
    const [analyticsData, setAnalyticsData] = useState({
        users: 0,
        products: 0,
        totalSales: 0,
        totalRevenue: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [dailySalesData, setDailySalesData] = useState([]);
    const [weeklySalesData, setWeeklySalesData] = useState([]);
    const [monthlySalesData, setMonthlySalesData] = useState([]);
    const [yearlySalesData, setYearlySalesData] = useState([]);
    const [dateRange, setDateRange] = useState('daily');

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get("/analytics"); // Make the API call
                // Assuming the backend returns data in the structure:
                // {
                //   analyticsData: { users, products, totalSales, totalRevenue },
                //   dailySalesData: [],
                //   weeklySalesData: [],
                //   monthlySalesData: [],
                //   yearlySalesData: []
                // }
                setAnalyticsData(response.data.analyticsData);
                setDailySalesData(response.data.dailySalesData);
                setWeeklySalesData(response.data.weeklySalesData);
                setMonthlySalesData(response.data.monthlySalesData);
                setYearlySalesData(response.data.yearlySalesData);
            } catch (error) {
                console.error("Error fetching analytics data:", error);
                //  Handle error appropriately, e.g., show a message to the user
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    const getSalesData = () => {
        switch (dateRange) {
            case 'daily':
                return dailySalesData;
            case 'weekly':
                return weeklySalesData;
            case 'monthly':
                return monthlySalesData;
            case 'yearly':
                return yearlySalesData;
            default:
                return dailySalesData;
        }
    };

    const getTitle = () => {
        switch (dateRange) {
            case 'daily':
                return "Daily Sales and Revenue";
            case 'weekly':
                return "Weekly Sales and Revenue";
            case 'monthly':
                return "Monthly Sales and Revenue";
            case 'yearly':
                return "Yearly Sales and Revenue";
            default:
                return "Daily Sales and Revenue";
        }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                <AnalyticsCard
                    title='Total Users'
                    value={analyticsData.users.toLocaleString()}
                    icon={Users}
                    color='from-emerald-500 to-teal-700'
                />
                <AnalyticsCard
                    title='Total Products'
                    value={analyticsData.products.toLocaleString()}
                    icon={Package}
                    color='from-emerald-500 to-green-700'
                />
                <AnalyticsCard
                    title='Total Sales'
                    value={analyticsData.totalSales.toLocaleString()}
                    icon={ShoppingCart}
                    color='from-emerald-500 to-cyan-700'
                />
                <AnalyticsCard
                    title='Total Revenue'
                    value={`₹${analyticsData.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    color='from-emerald-500 to-lime-700'
                />
            </div>
            <motion.div
                className='bg-gray-800/60 rounded-lg p-6 shadow-lg'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
            >
                <h2 className='text-white text-2xl font-semibold mb-4'>{getTitle()}</h2>
                <ResponsiveContainer width='100%' height={400}>
                    <LineChart data={getSalesData()}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='name' stroke='#D1D5DB' />
                        <YAxis yAxisId='left' stroke='#D1D5DB' />
                        <YAxis yAxisId='right' orientation='right' stroke='#D1D5DB' />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#374151', borderColor: '#4B5563', color: '#F9FAFB' }}
                            labelStyle={{ color: '#F9FAFB' }}
                            itemStyle={{ color: '#F9FAFB' }}
                        />
                        <Legend wrapperStyle={{ color: '#F9FAFB' }} />
                        <Line
                            yAxisId='left'
                            type='monotone'
                            dataKey='sales'
                            stroke='#10B981'
                            activeDot={{ r: 8 }}
                            name='Sales'
                        />
                        <Line
                            yAxisId='right'
                            type='monotone'
                            dataKey='revenue'
                            stroke='#3B82F6'
                            activeDot={{ r: 8 }}
                            name='Revenue'
                        />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>
            <div className="flex gap-4 mt-4 justify-center">
                <button
                    className={`px-4 py-2 rounded ${dateRange === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => setDateRange('daily')}
                >
                    Daily
                </button>
                <button
                    className={`px-4 py-2 rounded ${dateRange === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => setDateRange('weekly')}
                >
                    Weekly
                </button>
                <button
                    className={`px-4 py-2 rounded ${dateRange === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => setDateRange('monthly')}
                >
                    Monthly
                </button>
                <button
                    className={`px-4 py-2 rounded ${dateRange === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => setDateRange('yearly')}
                >
                    Yearly
                </button>
            </div>
        </div>
    );
};
export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
        className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className='flex justify-between items-center'>
            <div className='z-10'>
                <p className='text-emerald-300 text-sm mb-1 font-semibold'>{title}</p>
                <h3 className='text-white text-3xl font-bold'>{value}</h3>
            </div>
        </div>
        <div className='absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30' />
        <div className='absolute -bottom-4 -right-4 text-emerald-800 opacity-50'>
            <Icon className='h-32 w-32' />
        </div>
    </motion.div>
);

