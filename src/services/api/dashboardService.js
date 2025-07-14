export const getDashboardData = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // For now, return mock data until dashboard aggregation is implemented
    return {
      summary: {
        totalClients: 24,
        activeProjects: 8,
        pendingTasks: 47,
        monthlyRevenue: 12450,
        completedTasks: 156,
        overdueItems: 3
      },
      recentActivity: [
        {
          id: 1,
          type: "project",
          title: "Project 'Website Redesign' marked as completed",
          client: "TechCorp Inc",
          time: "2 hours ago",
          icon: "CheckCircle2"
        },
        {
          id: 2,
          type: "task",
          title: "New task assigned: 'Review wireframes'",
          client: "StartupXYZ",
          time: "4 hours ago",
          icon: "Plus"
        },
        {
          id: 3,
          type: "invoice",
          title: "Invoice #1247 sent to client",
          client: "Digital Agency",
          time: "6 hours ago",
          icon: "FileText"
        },
        {
          id: 4,
          type: "client",
          title: "New client 'Fashion Brand' added",
          client: "Fashion Brand",
          time: "1 day ago",
          icon: "UserPlus"
        },
        {
          id: 5,
          type: "payment",
          title: "Payment received from TechCorp Inc",
          client: "TechCorp Inc",
          time: "2 days ago",
          icon: "DollarSign"
        }
      ],
      quickStats: {
        projectsThisWeek: 3,
        tasksCompleted: 24,
        hoursTracked: 168,
        invoicesSent: 5
      }
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};