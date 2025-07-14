import { toast } from "react-toastify";

const tableName = "task";

export const getAllTasks = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "dueDate" } },
        { field: { Name: "total_time" } },
        { field: { Name: "project_id" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } }
      ]
    };

    const response = await apperClient.fetchRecords(tableName, params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    // Add mock time tracking data for backwards compatibility
    const tasks = (response.data || []).map(task => ({
      ...task,
      projectId: task.project_id, // Map for backwards compatibility
      timeTracking: {
        totalTime: task.total_time || 0,
        activeTimer: null,
        timeLogs: []
      }
    }));

    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const getTaskById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "dueDate" } },
        { field: { Name: "total_time" } },
        { field: { Name: "project_id" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } }
      ]
    };

    const response = await apperClient.getRecordById(tableName, parseInt(id), params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (!response.data) {
      throw new Error("Task not found");
    }

    // Add time tracking structure for backwards compatibility
    const task = {
      ...response.data,
      projectId: response.data.project_id,
      timeTracking: {
        totalTime: response.data.total_time || 0,
        activeTimer: null,
        timeLogs: []
      }
    };

    return task;
  } catch (error) {
    console.error(`Error fetching task with ID ${id}:`, error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include Updateable fields
    const recordData = {
      Name: taskData.title || taskData.Name,
      title: taskData.title,
      priority: taskData.priority || "medium",
      status: taskData.status || "todo",
      dueDate: taskData.dueDate,
      total_time: parseInt(taskData.total_time) || 0,
      project_id: parseInt(taskData.projectId || taskData.project_id),
      Tags: taskData.Tags || ""
    };

    const params = {
      records: [recordData]
    };

    const response = await apperClient.createRecord(tableName, params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);

      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }

      if (successfulRecords.length > 0) {
        const task = successfulRecords[0].data;
        return {
          ...task,
          projectId: task.project_id,
          timeTracking: {
            totalTime: task.total_time || 0,
            activeTimer: null,
            timeLogs: []
          }
        };
      }
    }

    throw new Error("No records were created successfully");
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include Updateable fields
    const recordData = {
      Id: parseInt(id),
      Name: taskData.title || taskData.Name,
      title: taskData.title,
      priority: taskData.priority,
      status: taskData.status,
      dueDate: taskData.dueDate,
      total_time: parseInt(taskData.total_time) || 0,
      project_id: parseInt(taskData.projectId || taskData.project_id),
      Tags: taskData.Tags || ""
    };

    const params = {
      records: [recordData]
    };

    const response = await apperClient.updateRecord(tableName, params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);

      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }

      if (successfulUpdates.length > 0) {
        const task = successfulUpdates[0].data;
        return {
          ...task,
          projectId: task.project_id,
          timeTracking: {
            totalTime: task.total_time || 0,
            activeTimer: null,
            timeLogs: []
          }
        };
      }
    }

    throw new Error("No records were updated successfully");
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const updateTaskStatus = async (id, status) => {
  return updateTask(id, { status });
};

export const deleteTask = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await apperClient.deleteRecord(tableName, params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);

      if (failedDeletions.length > 0) {
        console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }

      return successfulDeletions.length > 0;
    }

    return false;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Mock implementations for time tracking (until time_log table integration)
export const startTaskTimer = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const now = new Date().toISOString();
  
  return {
    Id: parseInt(id),
    startTime: now
  };
};

export const stopTaskTimer = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const now = new Date().toISOString();
  
  return {
    Id: parseInt(id),
    startTime: now,
    endTime: now,
    duration: 0,
    date: now.split('T')[0]
  };
};

export const getTaskTimeLogs = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 150));
  return [];
};