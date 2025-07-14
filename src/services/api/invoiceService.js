import { toast } from "react-toastify";

const tableName = "app_invoice";

export const getAllInvoices = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "client_id" } },
        { field: { Name: "project_id" } },
        { field: { Name: "amount" } },
        { field: { Name: "status" } },
        { field: { Name: "dueDate" } },
        { field: { Name: "paymentDate" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } }
      ]
    };

    const response = await apperClient.fetchRecords(tableName, params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    // Map field names for backwards compatibility
    const invoices = (response.data || []).map(invoice => ({
      ...invoice,
      clientId: invoice.client_id,
      projectId: invoice.project_id
    }));

    return invoices;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const getInvoiceById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "client_id" } },
        { field: { Name: "project_id" } },
        { field: { Name: "amount" } },
        { field: { Name: "status" } },
        { field: { Name: "dueDate" } },
        { field: { Name: "paymentDate" } },
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
      throw new Error("Invoice not found");
    }

    // Map field names for backwards compatibility
    const invoice = {
      ...response.data,
      clientId: response.data.client_id,
      projectId: response.data.project_id
    };

    return invoice;
  } catch (error) {
    console.error(`Error fetching invoice with ID ${id}:`, error);
    throw error;
  }
};

export const createInvoice = async (invoiceData) => {
  try {
    // Validate required fields
    if (!invoiceData.projectId) {
      throw new Error("Project ID is required");
    }
    if (!invoiceData.amount || invoiceData.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
    if (!invoiceData.dueDate) {
      throw new Error("Due date is required");
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include Updateable fields
    const recordData = {
      Name: `Invoice-${Date.now()}`,
      client_id: parseInt(invoiceData.clientId || invoiceData.client_id) || 1,
      project_id: parseInt(invoiceData.projectId || invoiceData.project_id),
      amount: parseFloat(invoiceData.amount),
      status: invoiceData.status || "draft",
      dueDate: invoiceData.dueDate,
      Tags: invoiceData.Tags || ""
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
        const invoice = successfulRecords[0].data;
        return {
          ...invoice,
          clientId: invoice.client_id,
          projectId: invoice.project_id
        };
      }
    }

    throw new Error("No records were created successfully");
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const updateInvoice = async (id, invoiceData) => {
  try {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error("Invalid invoice ID");
    }

    if (invoiceData.amount !== undefined && invoiceData.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include Updateable fields
    const recordData = {
      Id: parsedId,
      client_id: parseInt(invoiceData.clientId || invoiceData.client_id),
      project_id: parseInt(invoiceData.projectId || invoiceData.project_id),
      amount: parseFloat(invoiceData.amount),
      status: invoiceData.status,
      dueDate: invoiceData.dueDate,
      Tags: invoiceData.Tags || ""
    };

    if (invoiceData.paymentDate) {
      recordData.paymentDate = new Date(invoiceData.paymentDate).toISOString();
    }

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
        const invoice = successfulUpdates[0].data;
        return {
          ...invoice,
          clientId: invoice.client_id,
          projectId: invoice.project_id
        };
      }
    }

    throw new Error("No records were updated successfully");
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

export const markInvoiceAsSent = async (id) => {
  return updateInvoice(id, { status: "sent" });
};

export const markInvoiceAsPaid = async (id, paymentDate) => {
  if (!paymentDate) {
    throw new Error("Payment date is required");
  }

  return updateInvoice(id, { 
    status: "paid", 
    paymentDate: new Date(paymentDate).toISOString() 
  });
};

export const deleteInvoice = async (id) => {
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
    console.error("Error deleting invoice:", error);
    throw error;
  }
};