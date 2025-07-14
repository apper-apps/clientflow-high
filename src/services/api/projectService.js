import { toast } from "react-toastify";

const tableName = "project";

export const getAllProjects = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "status" } },
        { field: { Name: "budget" } },
        { field: { Name: "startDate" } },
        { field: { Name: "endDate" } },
        { field: { Name: "client_id" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } }
      ]
    };

    const response = await apperClient.fetchRecords(tableName, params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const getProjectById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "status" } },
        { field: { Name: "budget" } },
        { field: { Name: "startDate" } },
        { field: { Name: "endDate" } },
        { field: { Name: "client_id" } },
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
      throw new Error("Project not found");
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include Updateable fields
    const recordData = {
      Name: projectData.name || projectData.Name,
      status: projectData.status || "planning",
      budget: parseFloat(projectData.budget) || 0,
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      client_id: parseInt(projectData.clientId || projectData.client_id),
      Tags: projectData.Tags || ""
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
        return successfulRecords[0].data;
      }
    }

    throw new Error("No records were created successfully");
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include Updateable fields
    const recordData = {
      Id: parseInt(id),
      Name: projectData.name || projectData.Name,
      status: projectData.status,
      budget: parseFloat(projectData.budget),
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      client_id: parseInt(projectData.clientId || projectData.client_id),
      Tags: projectData.Tags || ""
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
        return successfulUpdates[0].data;
      }
    }

    throw new Error("No records were updated successfully");
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (id) => {
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
    console.error("Error deleting project:", error);
    throw error;
  }
};