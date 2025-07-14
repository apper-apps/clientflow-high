import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import ClientModal from "@/components/molecules/ClientModal";
import { getAllClients } from "@/services/api/clientService";

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const loadClients = async () => {
    try {
      setLoading(true);
      setError("");
      const clientData = await getAllClients();
      setClients(clientData);
    } catch (err) {
      setError("Failed to load clients. Please try again.");
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
};

const handleClientCreated = (newClient) => {
    setClients(prev => [...prev, newClient]);
  };

  const handleClientUpdated = (updatedClient) => {
    setClients(prev => prev.map(client => 
      client.Id === updatedClient.Id ? updatedClient : client
    ));
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowModal(true);
    setOpenDropdown(null);
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      try {
        const { deleteClient } = await import('@/services/api/clientService');
        await deleteClient(clientId);
        setClients(prev => prev.filter(client => client.Id !== clientId));
        toast.success('Client deleted successfully');
      } catch (error) {
        toast.error('Failed to delete client');
      }
    }
    setOpenDropdown(null);
  };

  const handleMenuToggle = (clientId, event) => {
    event.stopPropagation();
    setOpenDropdown(openDropdown === clientId ? null : clientId);
  };

  const handleClientClick = (clientId) => {
    navigate(`/clients/${clientId}`);
  };

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);
const filteredClients = clients.filter(client =>
    (client.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (client.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (client.company?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadClients} />;
  }

  if (clients.length === 0) {
    return (
<Empty
        title="No Clients Yet"
        description="Start building your client base by adding your first client"
        icon="Users"
        actionLabel="Add First Client"
        onAction={() => setShowModal(true)}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
              <ApperIcon name="Users" size={18} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Clients
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your client relationships and contacts
          </p>
        </div>
        
<Button variant="primary" onClick={() => setShowModal(true)}>
          <ApperIcon name="UserPlus" size={16} className="mr-2" />
          Add Client
        </Button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <SearchBar
          placeholder="Search clients by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ApperIcon name="Filter" size={16} className="mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-sm text-gray-600 dark:text-gray-400"
      >
        Showing {filteredClients.length} of {clients.length} clients
      </motion.div>

      {/* Clients Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredClients.map((client, index) => (
          <motion.div
            key={client.Id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
>
            <div
              onClick={() => handleClientClick(client.Id)}
              className="cursor-pointer"
            >
<Card hover className="p-6 h-full transition-all duration-200 hover:shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                      {client.Name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {client.Name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {client.company}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={client.status === "active" ? "success" : "secondary"}>
                      {client.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ApperIcon name="Mail" size={14} />
                    <span className="truncate">{client.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ApperIcon name="Calendar" size={14} />
                    <span>Client since {new Date(client.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
<div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `mailto:${client.email}`;
                    }}
                  >
                    <ApperIcon name="MessageSquare" size={14} className="mr-2" />
                    Contact
                  </Button>
                  
<div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/clients/${client.Id}`);
                      }}
                    >
                      <ApperIcon name="Eye" size={14} />
                    </Button>
                    <div className="relative">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => handleMenuToggle(client.Id, e)}
                      >
                        <ApperIcon name="MoreHorizontal" size={16} />
                      </Button>
                      
                      {openDropdown === client.Id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClient(client);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                              <ApperIcon name="Edit" size={14} />
                              Edit Client
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClient(client.Id);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                            >
                              <ApperIcon name="Trash2" size={14} />
                              Delete Client
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredClients.length === 0 && searchTerm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Empty
            title="No Clients Found"
            description={`No clients match "${searchTerm}". Try adjusting your search.`}
            icon="Search"
            actionLabel="Clear Search"
            onAction={() => setSearchTerm("")}
          />
</motion.div>
      )}

      {/* Client Modal */}
<ClientModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingClient(null);
        }}
        onClientCreated={handleClientCreated}
        onClientUpdated={handleClientUpdated}
        client={editingClient}
      />
    </div>
  );
};

export default Clients;