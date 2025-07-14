import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from '@/components/atoms/Modal';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import { getAllClients } from '@/services/api/clientService';

const ProjectModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  project = null,
  title = "Create New Project",
  clients = []
}) => {
const [formData, setFormData] = useState({
    Name: '',
    description: '',
    client_id: '',
    status: 'planning',
    budget: '',
    startDate: '',
    endDate: ''
  });
const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});


// Populate form when editing existing project
useEffect(() => {
    if (project) {
      setFormData({
        Name: project.Name || project.name || '',
        description: project.description || '',
        client_id: project.client_id || project.clientId || '',
        status: project.status || 'planning',
        budget: project.budget || '',
        startDate: project.startDate || '',
        endDate: project.endDate || ''
      });
    } else {
      setFormData({
        Name: '',
        description: '',
        client_id: '',
        status: 'planning',
        budget: '',
        startDate: '',
        endDate: ''
      });
    }
    setErrors({});
  }, [project]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
const newErrors = {};

    if (!formData.Name.trim()) {
      newErrors.Name = 'Project name is required';
    }

    if (!formData.client_id) {
      newErrors.client_id = 'Client selection is required';
    }

    if (formData.budget && isNaN(parseFloat(formData.budget))) {
      newErrors.budget = 'Budget must be a valid number';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
const projectData = {
        Name: formData.Name,
        status: formData.status,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        startDate: formData.startDate,
        endDate: formData.endDate,
        client_id: formData.client_id ? parseInt(formData.client_id) : null
      };

      await onSubmit(projectData);
      onClose();
    } catch (error) {
      console.error('Failed to save project:', error);
      // Error handling - show user feedback
      toast.error(error.message || 'Failed to save project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'planning', label: 'Planning', variant: 'secondary' },
    { value: 'active', label: 'Active', variant: 'primary' },
    { value: 'on-hold', label: 'On Hold', variant: 'warning' },
    { value: 'completed', label: 'Completed', variant: 'success' }
  ];

const getClientName = (clientId) => {
    const client = clients.find(c => c.Id === parseInt(clientId));
    return client ? client.Name : 'Unknown Client';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Name *
          </label>
<Input
            name="Name"
            type="text"
            value={formData.Name}
            onChange={handleInputChange}
            placeholder="Enter project name"
            error={errors.Name}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter project description"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400 resize-none"
          />
        </div>

{/* Client Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Client *
          </label>
          {clients.length === 0 ? (
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-12 rounded-lg"></div>
          ) : (
<select
              name="client_id"
              value={formData.client_id}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg 
                        focus:ring-2 focus:ring-primary-500 focus:border-transparent
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                        ${errors.client_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              required
            >
<option value="">Choose a client...</option>
              {clients.map(client => (
                <option key={client.Id} value={client.Id}>
                  {client.Name}
                </option>
              ))}
            </select>
          )}
{errors.client_id && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.client_id}</p>
          )}
        </div>

        {/* Status and Budget Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Budget
            </label>
            <Input
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleInputChange}
              placeholder="0.00"
              error={errors.budget}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <Input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <Input
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              error={errors.endDate}
              min={formData.startDate}
            />
          </div>
        </div>

{/* Preview Selected Client */}
        {formData.client_id && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Selected Client
            </h4>
            <p className="text-gray-900 dark:text-white">{getClientName(formData.client_id)}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
<Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {project ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;