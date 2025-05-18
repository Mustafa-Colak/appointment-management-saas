import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Flex, 
  Grid, 
  Card, 
  CardBody, 
  Stack, 
  Divider, 
  CardFooter, 
  Avatar, 
  Badge, 
  Input, 
  Select, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton, 
  ModalFooter,
  FormControl,
  FormLabel,
  Spinner,
  useDisclosure,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiMoreVertical, FiCalendar, FiUser, FiMail, FiPhone, FiClipboard } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StaffCalendar from '../components/StaffCalendar';
import StaffPerformanceChart from '../components/StaffPerformanceChart';
import WorkingHoursForm from '../components/WorkingHoursForm';

const StaffPage = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [view, setView] = useState('grid'); // 'grid' or 'table'
  
  const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const { isOpen: isCalendarOpen, onOpen: onCalendarOpen, onClose: onCalendarClose } = useDisclosure();
  
  const toast = useToast();
  const navigate = useNavigate();
  
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    specialties: [],
    bio: '',
    image: null
  });

  // Fetch staff data
  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        setIsLoading(true);
        // Replace with your actual API endpoint
        const response = await axios.get('/api/v1/staff');
        setStaffMembers(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching staff members:', error);
        toast({
          title: 'Error',
          description: 'Failed to load staff members. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    };

    fetchStaffMembers();
  }, [toast]);

  // Filter staff based on search query and role filter
  const filteredStaff = staffMembers.filter(staff => {
    const nameMatch = `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch = filterRole ? staff.role === filterRole : true;
    return nameMatch && roleMatch;
  });

  // Handler for form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new staff member
  const handleAddStaff = async () => {
    try {
      setIsLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.post('/api/v1/staff', newStaff);
      setStaffMembers(prev => [...prev, response.data]);
      
      toast({
        title: 'Success',
        description: 'Staff member added successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      setNewStaff({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        specialties: [],
        bio: '',
        image: null
      });
      
      onAddModalClose();
      setIsLoading(false);
    } catch (error) {
      console.error('Error adding staff member:', error);
      toast({
        title: 'Error',
        description: 'Failed to add staff member. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  // Update staff member
  const handleUpdateStaff = async () => {
    try {
      setIsLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.put(`/api/v1/staff/${selectedStaff.id}`, selectedStaff);
      
      setStaffMembers(prev => 
        prev.map(staff => staff.id === selectedStaff.id ? response.data : staff)
      );
      
      toast({
        title: 'Success',
        description: 'Staff member updated successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      onEditModalClose();
      setIsLoading(false);
    } catch (error) {
      console.error('Error updating staff member:', error);
      toast({
        title: 'Error',
        description: 'Failed to update staff member. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  // Delete staff member
  const handleDeleteStaff = async () => {
    try {
      setIsLoading(true);
      // Replace with your actual API endpoint
      await axios.delete(`/api/v1/staff/${selectedStaff.id}`);
      
      setStaffMembers(prev => 
        prev.filter(staff => staff.id !== selectedStaff.id)
      );
      
      toast({
        title: 'Success',
        description: 'Staff member deleted successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      onDeleteModalClose();
      setIsLoading(false);
    } catch (error) {
      console.error('Error deleting staff member:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete staff member. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  // Edit staff handler
  const handleEditClick = (staff) => {
    setSelectedStaff(staff);
    onEditModalOpen();
  };

  // Delete staff handler
  const handleDeleteClick = (staff) => {
    setSelectedStaff(staff);
    onDeleteModalOpen();
  };

  // View staff calendar handler
  const handleViewCalendar = (staff) => {
    setSelectedStaff(staff);
    onCalendarOpen();
  };

  // View staff profile handler
  const handleViewProfile = (staffId) => {
    navigate(`/staff/${staffId}`);
  };

  // Role options for filter and form
  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'barber', label: 'Barber' },
    { value: 'hairdresser', label: 'Hairdresser' },
    { value: 'dentist', label: 'Dentist' },
    { value: 'veterinarian', label: 'Veterinarian' },
    { value: 'assistant', label: 'Assistant' },
    { value: 'receptionist', label: 'Receptionist' },
    { value: 'manager', label: 'Manager' },
  ];

  // Render staff members in grid view
  const renderGridView = () => (
    <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={6}>
      {filteredStaff.map((staff) => (
        <Card key={staff.id} maxW="sm" variant="outline">
          <CardBody>
            <Flex direction="column" align="center" mb={4}>
              <Avatar 
                size="xl" 
                name={`${staff.firstName} ${staff.lastName}`} 
                src={staff.image} 
                mb={3}
              />
              <Heading size="md">{staff.firstName} {staff.lastName}</Heading>
              <Badge colorScheme={
                staff.role === 'manager' ? 'purple' : 
                staff.role === 'barber' ? 'blue' : 
                staff.role === 'hairdresser' ? 'pink' : 
                staff.role === 'dentist' ? 'teal' : 
                staff.role === 'veterinarian' ? 'green' : 
                'gray'
              } mt={2}>
                {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
              </Badge>
            </Flex>
            
            <Stack mt={6} spacing={3}>
              <Flex align="center">
                <Box as={FiMail} mr={2} />
                <Text>{staff.email}</Text>
              </Flex>
              <Flex align="center">
                <Box as={FiPhone} mr={2} />
                <Text>{staff.phone}</Text>
              </Flex>
              {staff.specialties && staff.specialties.length > 0 && (
                <Flex align="flex-start" wrap="wrap" gap={1}>
                  <Box as={FiClipboard} mr={2} mt={1} />
                  <Box>
                    {staff.specialties.map((specialty, index) => (
                      <Badge key={index} mr={1} mb={1} colorScheme="blue" variant="outline">
                        {specialty}
                      </Badge>
                    ))}
                  </Box>
                </Flex>
              )}
            </Stack>
          </CardBody>
          <Divider />
          <CardFooter>
            <Flex width="100%" justify="space-between">
              <Button variant="ghost" leftIcon={<FiUser />} size="sm" onClick={() => handleViewProfile(staff.id)}>
                Profile
              </Button>
              <Button variant="ghost" leftIcon={<FiCalendar />} size="sm" onClick={() => handleViewCalendar(staff)}>
                Schedule
              </Button>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<FiMoreVertical />}
                  variant="ghost"
                  size="sm"
                />
                <MenuList>
                  <MenuItem icon={<FiEdit2 />} onClick={() => handleEditClick(staff)}>
                    Edit
                  </MenuItem>
                  <MenuItem icon={<FiTrash2 />} onClick={() => handleDeleteClick(staff)}>
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </CardFooter>
        </Card>
      ))}
    </Grid>
  );

  // Render staff members in table view
  const renderTableView = () => (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Role</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Specialties</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredStaff.map((staff) => (
            <Tr key={staff.id}>
              <Td>
                <Flex align="center">
                  <Avatar 
                    size="sm" 
                    name={`${staff.firstName} ${staff.lastName}`} 
                    src={staff.image} 
                    mr={2}
                  />
                  {staff.firstName} {staff.lastName}
                </Flex>
              </Td>
              <Td>
                <Badge colorScheme={
                  staff.role === 'manager' ? 'purple' : 
                  staff.role === 'barber' ? 'blue' : 
                  staff.role === 'hairdresser' ? 'pink' : 
                  staff.role === 'dentist' ? 'teal' : 
                  staff.role === 'veterinarian' ? 'green' : 
                  'gray'
                }>
                  {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                </Badge>
              </Td>
              <Td>{staff.email}</Td>
              <Td>{staff.phone}</Td>
              <Td>
                <Flex align="flex-start" wrap="wrap" gap={1}>
                  {staff.specialties && staff.specialties.map((specialty, index) => (
                    <Badge key={index} colorScheme="blue" variant="outline">
                      {specialty}
                    </Badge>
                  ))}
                </Flex>
              </Td>
              <Td>
                <Flex gap={2}>
                  <IconButton
                    aria-label="View profile"
                    icon={<FiUser />}
                    size="sm"
                    onClick={() => handleViewProfile(staff.id)}
                  />
                  <IconButton
                    aria-label="View schedule"
                    icon={<FiCalendar />}
                    size="sm"
                    onClick={() => handleViewCalendar(staff)}
                  />
                  <IconButton
                    aria-label="Edit staff"
                    icon={<FiEdit2 />}
                    size="sm"
                    onClick={() => handleEditClick(staff)}
                  />
                  <IconButton
                    aria-label="Delete staff"
                    icon={<FiTrash2 />}
                    size="sm"
                    onClick={() => handleDeleteClick(staff)}
                  />
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );

  return (
    <Box p={4}>
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        justify="space-between" 
        align={{ base: 'flex-start', md: 'center' }}
        mb={6}
        wrap="wrap"
        gap={4}
      >
        <Box>
          <Heading size="lg">Staff Management</Heading>
          <Text color="gray.600">Manage your team and their schedules</Text>
        </Box>
        
        <Flex gap={4} align="center" wrap="wrap">
          <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onAddModalOpen}>
            Add Staff Member
          </Button>
          
          <Flex gap={2}>
            <Button 
              variant={view === 'grid' ? 'solid' : 'outline'} 
              onClick={() => setView('grid')}
            >
              Grid
            </Button>
            <Button 
              variant={view === 'table' ? 'solid' : 'outline'} 
              onClick={() => setView('table')}
            >
              Table
            </Button>
          </Flex>
        </Flex>
      </Flex>

      {/* Search and Filters */}
      <Flex 
        mb={6} 
        gap={4} 
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'stretch', md: 'center' }}
      >
        <Input
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          width={{ base: '100%', md: '300px' }}
        />
        
        <Select
          placeholder="Filter by role"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          width={{ base: '100%', md: '200px' }}
        >
          {roleOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Flex>

      {/* Staff List */}
      {isLoading ? (
        <Flex justify="center" my={10}>
          <Spinner size="xl" />
        </Flex>
      ) : filteredStaff.length === 0 ? (
        <Flex 
          direction="column" 
          align="center" 
          justify="center" 
          p={10} 
          bg="gray.50" 
          borderRadius="md"
        >
          <Text fontSize="lg" mb={4}>No staff members found</Text>
          <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onAddModalOpen}>
            Add Staff Member
          </Button>
        </Flex>
      ) : (
        view === 'grid' ? renderGridView() : renderTableView()
      )}

      {/* Add Staff Modal */}
      <Modal isOpen={isAddModalOpen} onClose={onAddModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Staff Member</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input 
                  name="firstName" 
                  value={newStaff.firstName} 
                  onChange={handleInputChange} 
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input 
                  name="lastName" 
                  value={newStaff.lastName} 
                  onChange={handleInputChange} 
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input 
                  name="email" 
                  type="email" 
                  value={newStaff.email} 
                  onChange={handleInputChange} 
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Phone</FormLabel>
                <Input 
                  name="phone" 
                  value={newStaff.phone} 
                  onChange={handleInputChange} 
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Select 
                  name="role" 
                  value={newStaff.role} 
                  onChange={handleInputChange}
                  placeholder="Select role"
                >
                  {roleOptions.filter(option => option.value).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <FormControl mt={4}>
              <FormLabel>Bio</FormLabel>
              <Input 
                name="bio" 
                value={newStaff.bio} 
                onChange={handleInputChange} 
              />
            </FormControl>
            
            {/* Specialties and working hours would be added here with custom components */}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddModalClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleAddStaff} 
              isLoading={isLoading}
            >
              Add Staff Member
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Staff Modal */}
      {selectedStaff && (
        <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Staff Member</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                <FormControl isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input 
                    name="firstName" 
                    value={selectedStaff.firstName} 
                    onChange={(e) => setSelectedStaff({...selectedStaff, firstName: e.target.value})} 
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input 
                    name="lastName" 
                    value={selectedStaff.lastName} 
                    onChange={(e) => setSelectedStaff({...selectedStaff, lastName: e.target.value})} 
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    name="email" 
                    type="email" 
                    value={selectedStaff.email} 
                    onChange={(e) => setSelectedStaff({...selectedStaff, email: e.target.value})} 
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Phone</FormLabel>
                  <Input 
                    name="phone" 
                    value={selectedStaff.phone} 
                    onChange={(e) => setSelectedStaff({...selectedStaff, phone: e.target.value})} 
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Role</FormLabel>
                  <Select 
                    name="role" 
                    value={selectedStaff.role} 
                    onChange={(e) => setSelectedStaff({...selectedStaff, role: e.target.value})}
                  >
                    {roleOptions.filter(option => option.value).map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <FormControl mt={4}>
                <FormLabel>Bio</FormLabel>
                <Input 
                  name="bio" 
                  value={selectedStaff.bio} 
                  onChange={(e) => setSelectedStaff({...selectedStaff, bio: e.target.value})} 
                />
              </FormControl>
              
              {/* Specialties and working hours would be added here with custom components */}
              
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onEditModalClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={handleUpdateStaff} 
                isLoading={isLoading}
              >
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {selectedStaff && (
        <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Staff Member</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete {selectedStaff.firstName} {selectedStaff.lastName}? This action cannot be undone.
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onDeleteModalClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleDeleteStaff} 
                isLoading={isLoading}
              >
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Calendar Modal */}
      {selectedStaff && (
        <Modal isOpen={isCalendarOpen} onClose={onCalendarClose} size="xl">
          <ModalOverlay />
          <ModalContent maxW="800px">
            <ModalHeader>
              {selectedStaff.firstName} {selectedStaff.lastName}'s Schedule
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <StaffCalendar staffId={selectedStaff.id} />
              {/* We'd include a WorkingHoursForm component here */}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onCalendarClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default StaffPage;