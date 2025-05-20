import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Import icons
const CheckCircleIcon = getIcon('check-circle');
const PlusIcon = getIcon('plus');
const TrashIcon = getIcon('trash-2');
const EditIcon = getIcon('edit');
const DownloadIcon = getIcon('download');
const GithubIcon = getIcon('github');
const LinkedinIcon = getIcon('linkedin');
const GlobeIcon = getIcon('globe');
const PhoneIcon = getIcon('phone');
const MailIcon = getIcon('mail');
const MapPinIcon = getIcon('map-pin');
const UserIcon = getIcon('user');
const BriefcaseIcon = getIcon('briefcase');
const GraduationCapIcon = getIcon('graduation-cap');
const AwardIcon = getIcon('award');
const FileIcon = getIcon('file-text');

// Resume templates
const templates = [
  {
    id: 'modern',
    name: 'Modern',
    previewImage: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: 'Clean and professional design with a modern touch',
    color: 'bg-blue-500'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    previewImage: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: 'Simple and elegant style that focuses on content',
    color: 'bg-emerald-500'
  },
  {
    id: 'creative',
    name: 'Creative',
    previewImage: 'https://images.unsplash.com/photo-1567443024551-f3e3a7b9567f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: 'Bold design that helps you stand out',
    color: 'bg-purple-500'
  },
  {
    id: 'professional',
    name: 'Professional',
    previewImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: 'Traditional layout for corporate applications',
    color: 'bg-gray-700'
  }
];

const MainFeature = ({ currentStep }) => {
  const dispatch = useDispatch();
  const { selectedTemplate, userData } = useSelector(state => state.resume);
  const resumeRef = useRef(null);
  
  // Local state for form inputs
  const [workForm, setWorkForm] = useState({
    id: '',
    jobTitle: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    achievements: []
  });

  const [eduForm, setEduForm] = useState({
    id: '',
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const [certForm, setCertForm] = useState({
    id: '',
    name: '',
    issuer: '',
    date: '',
    description: ''
  });

  const [editingWork, setEditingWork] = useState(null);
  const [editingEdu, setEditingEdu] = useState(null);
  const [editingCert, setEditingCert] = useState(null);
  const [skill, setSkill] = useState('');

  // Handle template selection
  const selectTemplate = (template) => {
    dispatch({ type: 'SET_TEMPLATE', payload: template });
    toast.success(`Selected the ${template.name} template`);
  };

  // Handle personal info updates
  const updatePersonalInfo = (field, value) => {
    dispatch({ 
      type: 'UPDATE_PERSONAL_INFO', 
      payload: { [field]: value } 
    });
  };

  // Handle summary update
  const updateSummary = (value) => {
    dispatch({ 
      type: 'UPDATE_PROFESSIONAL_SUMMARY', 
      payload: value
    });
  };

  // Work experience handlers
  const addWorkExperience = (e) => {
    e.preventDefault();
    if (!workForm.jobTitle || !workForm.company) {
      toast.error("Job title and company are required");
      return;
    }

    const newWork = {
      ...workForm,
      id: editingWork || Date.now().toString()
    };

    if (editingWork) {
      dispatch({ type: 'UPDATE_WORK_EXPERIENCE', payload: newWork });
      toast.success("Work experience updated");
      setEditingWork(null);
    } else {
      dispatch({ type: 'ADD_WORK_EXPERIENCE', payload: newWork });
      toast.success("Work experience added");
    }

    setWorkForm({
      id: '',
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      achievements: []
    });
  };

  const startEditWork = (work) => {
    setWorkForm(work);
    setEditingWork(work.id);
  };

  const cancelEditWork = () => {
    setWorkForm({
      id: '',
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      achievements: []
    });
    setEditingWork(null);
  };

  const deleteWork = (id) => {
    dispatch({ type: 'REMOVE_WORK_EXPERIENCE', payload: id });
    toast.success("Work experience removed");
    
    if (editingWork === id) {
      cancelEditWork();
    }
  };

  // Education handlers
  const addEducation = (e) => {
    e.preventDefault();
    if (!eduForm.degree || !eduForm.institution) {
      toast.error("Degree and institution are required");
      return;
    }

    const newEdu = {
      ...eduForm,
      id: editingEdu || Date.now().toString()
    };

    if (editingEdu) {
      dispatch({ type: 'UPDATE_EDUCATION', payload: newEdu });
      toast.success("Education updated");
      setEditingEdu(null);
    } else {
      dispatch({ type: 'ADD_EDUCATION', payload: newEdu });
      toast.success("Education added");
    }

    setEduForm({
      id: '',
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  };

  const startEditEdu = (edu) => {
    setEduForm(edu);
    setEditingEdu(edu.id);
  };

  const cancelEditEdu = () => {
    setEduForm({
      id: '',
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    });
    setEditingEdu(null);
  };

  const deleteEdu = (id) => {
    dispatch({ type: 'REMOVE_EDUCATION', payload: id });
    toast.success("Education removed");
    
    if (editingEdu === id) {
      cancelEditEdu();
    }
  };

  // Certification handlers
  const addCertification = (e) => {
    e.preventDefault();
    if (!certForm.name || !certForm.issuer) {
      toast.error("Certification name and issuer are required");
      return;
    }

    const newCert = {
      ...certForm,
      id: editingCert || Date.now().toString()
    };

    if (editingCert) {
      dispatch({ type: 'UPDATE_CERTIFICATION', payload: newCert });
      toast.success("Certification updated");
      setEditingCert(null);
    } else {
      dispatch({ type: 'ADD_CERTIFICATION', payload: newCert });
      toast.success("Certification added");
    }

    setCertForm({
      id: '',
      name: '',
      issuer: '',
      date: '',
      description: ''
    });
  };

  const startEditCert = (cert) => {
    setCertForm(cert);
    setEditingCert(cert.id);
  };

  const cancelEditCert = () => {
    setCertForm({
      id: '',
      name: '',
      issuer: '',
      date: '',
      description: ''
    });
    setEditingCert(null);
  };

  const deleteCert = (id) => {
    dispatch({ type: 'REMOVE_CERTIFICATION', payload: id });
    toast.success("Certification removed");
    
    if (editingCert === id) {
      cancelEditCert();
    }
  };

  // Skills handlers
  const addSkill = (e) => {
    e.preventDefault();
    if (!skill.trim()) return;
    
    const updatedSkills = [...userData.skills, skill.trim()];
    dispatch({ type: 'UPDATE_SKILLS', payload: updatedSkills });
    setSkill('');
  };

  const removeSkill = (index) => {
    const updatedSkills = [...userData.skills];
    updatedSkills.splice(index, 1);
    dispatch({ type: 'UPDATE_SKILLS', payload: updatedSkills });
  };

  // Download resume as PDF
  const downloadResume = async () => {
    if (!resumeRef.current) return;

    toast.info("Preparing your resume for download...");
    
    try {
      const scale = 2; // Higher scale for better quality
      const canvas = await html2canvas(resumeRef.current, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, imgWidth, imgHeight);
      
      // Add more pages if content overflows
      let position = imgHeight;
      while (position < canvas.height * imgWidth / canvas.width) {
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/jpeg', 0.9), 
          'JPEG', 
          0, 
          -(position - imgHeight), 
          imgWidth, 
          imgHeight
        );
        position += pageHeight;
      }
      
      pdf.save(`${userData.personalInfo.name || 'resume'}.pdf`);
      toast.success("Resume downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download resume. Please try again.");
    }
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-surface-900 dark:text-white">
              Choose Your Resume Template
            </h2>
            <p className="text-surface-600 dark:text-surface-400 mb-8">
              Select a template that best represents your professional style. You can preview how your resume will look.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  className={`
                    resume-template border-2 h-80
                    ${selectedTemplate?.id === template.id ? 'resume-template-selected' : 'border-surface-200 dark:border-surface-700'}
                  `}
                  onClick={() => selectTemplate(template)}
                >
                  <div className="relative h-full rounded-lg overflow-hidden">
                    {/* Template Preview Image */}
                    <img 
                      src={template.previewImage} 
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay with details */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 to-transparent flex flex-col justify-end p-4">
                      <div className={`w-8 h-8 rounded-full ${template.color} text-white flex items-center justify-center mb-2`}>
                        <FileIcon className="w-4 h-4" />
                      </div>
                      <h3 className="text-white text-xl font-semibold mb-1">
                        {template.name}
                      </h3>
                      <p className="text-surface-100 text-sm mb-3">
                        {template.description}
                      </p>
                      
                      {/* Selection Status */}
                      {selectedTemplate?.id === template.id && (
                        <div className="bg-primary text-white text-sm font-medium py-1.5 px-3 rounded-full inline-flex items-center">
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          Selected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-6 text-surface-900 dark:text-white">
              Enter Your Information
            </h2>
            <p className="text-surface-600 dark:text-surface-400 mb-8">
              Fill in your details to create a comprehensive resume. All fields marked with * are required.
            </p>
            
            {/* Personal Information */}
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center text-surface-900 dark:text-white">
                <UserIcon className="w-5 h-5 mr-2 text-primary" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="John Doe"
                    value={userData.personalInfo.name || ''}
                    onChange={(e) => updatePersonalInfo('name', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="john.doe@example.com"
                    value={userData.personalInfo.email || ''}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="+1 (555) 123-4567"
                    value={userData.personalInfo.phone || ''}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="New York, NY"
                    value={userData.personalInfo.address || ''}
                    onChange={(e) => updatePersonalInfo('address', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="form-label">LinkedIn</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="linkedin.com/in/johndoe"
                    value={userData.personalInfo.linkedIn || ''}
                    onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="form-label">Website/Portfolio</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="johndoe.com"
                    value={userData.personalInfo.website || ''}
                    onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Professional Summary */}
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center text-surface-900 dark:text-white">
                <FileIcon className="w-5 h-5 mr-2 text-primary" />
                Professional Summary
              </h3>
              
              <label className="form-label">Summary *</label>
              <textarea
                className="input-field min-h-32"
                placeholder="Brief overview of your professional background, key skills, and career goals..."
                value={userData.professionalSummary || ''}
                onChange={(e) => updateSummary(e.target.value)}
                required
              />
            </div>
            
            {/* Work Experience */}
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center text-surface-900 dark:text-white">
                <BriefcaseIcon className="w-5 h-5 mr-2 text-primary" />
                Work Experience
              </h3>
              
              {/* Work Experience Form */}
              <form onSubmit={addWorkExperience} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="form-label">Job Title *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Software Engineer"
                      value={workForm.jobTitle}
                      onChange={(e) => setWorkForm({...workForm, jobTitle: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Company *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Tech Company Inc."
                      value={workForm.company}
                      onChange={(e) => setWorkForm({...workForm, company: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="New York, NY"
                      value={workForm.location}
                      onChange={(e) => setWorkForm({...workForm, location: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="input-field"
                        value={workForm.startDate}
                        onChange={(e) => setWorkForm({...workForm, startDate: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="input-field"
                        value={workForm.endDate}
                        onChange={(e) => setWorkForm({...workForm, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="form-label">Description</label>
                  <textarea
                    className="input-field min-h-24"
                    placeholder="Describe your responsibilities and achievements..."
                    value={workForm.description}
                    onChange={(e) => setWorkForm({...workForm, description: e.target.value})}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingWork ? 'Update Experience' : 'Add Experience'}
                  </button>
                  
                  {editingWork && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={cancelEditWork}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
              
              {/* Work Experience List */}
              {userData.workExperience.length > 0 ? (
                <div className="space-y-4">
                  {userData.workExperience.map((work) => (
                    <div key={work.id} className="border border-surface-200 dark:border-surface-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-surface-900 dark:text-white">{work.jobTitle}</h4>
                          <p className="text-surface-600 dark:text-surface-400">{work.company}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditWork(work)}
                            className="p-1.5 text-surface-500 hover:text-primary"
                            aria-label="Edit work experience"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteWork(work.id)}
                            className="p-1.5 text-surface-500 hover:text-accent"
                            aria-label="Delete work experience"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-surface-500 dark:text-surface-400 flex items-center mb-2">
                        {work.location && (
                          <span className="flex items-center mr-3">
                            <MapPinIcon className="w-3.5 h-3.5 mr-1" />
                            {work.location}
                          </span>
                        )}
                        
                        {work.startDate && (
                          <span>
                            {work.startDate && format(new Date(work.startDate), 'MMM yyyy')}
                            {work.endDate ? ` - ${format(new Date(work.endDate), 'MMM yyyy')}` : ' - Present'}
                          </span>
                        )}
                      </div>
                      
                      {work.description && (
                        <p className="text-sm text-surface-700 dark:text-surface-300 mt-2">
                          {work.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 border border-dashed border-surface-300 dark:border-surface-700 rounded-lg">
                  <p className="text-surface-500 dark:text-surface-400">No work experience added yet</p>
                </div>
              )}
            </div>
            
            {/* Education */}
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center text-surface-900 dark:text-white">
                <GraduationCapIcon className="w-5 h-5 mr-2 text-primary" />
                Education
              </h3>
              
              {/* Education Form */}
              <form onSubmit={addEducation} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="form-label">Degree/Program *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Bachelor of Science in Computer Science"
                      value={eduForm.degree}
                      onChange={(e) => setEduForm({...eduForm, degree: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Institution *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="University of Technology"
                      value={eduForm.institution}
                      onChange={(e) => setEduForm({...eduForm, institution: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Boston, MA"
                      value={eduForm.location}
                      onChange={(e) => setEduForm({...eduForm, location: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="input-field"
                        value={eduForm.startDate}
                        onChange={(e) => setEduForm({...eduForm, startDate: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="input-field"
                        value={eduForm.endDate}
                        onChange={(e) => setEduForm({...eduForm, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="form-label">Description</label>
                  <textarea
                    className="input-field min-h-20"
                    placeholder="Describe your academic achievements, relevant coursework, etc."
                    value={eduForm.description}
                    onChange={(e) => setEduForm({...eduForm, description: e.target.value})}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingEdu ? 'Update Education' : 'Add Education'}
                  </button>
                  
                  {editingEdu && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={cancelEditEdu}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
              
              {/* Education List */}
              {userData.education.length > 0 ? (
                <div className="space-y-4">
                  {userData.education.map((edu) => (
                    <div key={edu.id} className="border border-surface-200 dark:border-surface-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-surface-900 dark:text-white">{edu.degree}</h4>
                          <p className="text-surface-600 dark:text-surface-400">{edu.institution}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditEdu(edu)}
                            className="p-1.5 text-surface-500 hover:text-primary"
                            aria-label="Edit education"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteEdu(edu.id)}
                            className="p-1.5 text-surface-500 hover:text-accent"
                            aria-label="Delete education"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-surface-500 dark:text-surface-400 flex items-center mb-2">
                        {edu.location && (
                          <span className="flex items-center mr-3">
                            <MapPinIcon className="w-3.5 h-3.5 mr-1" />
                            {edu.location}
                          </span>
                        )}
                        
                        {edu.startDate && (
                          <span>
                            {edu.startDate && format(new Date(edu.startDate), 'MMM yyyy')}
                            {edu.endDate ? ` - ${format(new Date(edu.endDate), 'MMM yyyy')}` : ' - Present'}
                          </span>
                        )}
                      </div>
                      
                      {edu.description && (
                        <p className="text-sm text-surface-700 dark:text-surface-300 mt-2">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 border border-dashed border-surface-300 dark:border-surface-700 rounded-lg">
                  <p className="text-surface-500 dark:text-surface-400">No education added yet</p>
                </div>
              )}
            </div>
            
            {/* Skills */}
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center text-surface-900 dark:text-white">
                <AwardIcon className="w-5 h-5 mr-2 text-primary" />
                Skills
              </h3>
              
              <form onSubmit={addSkill} className="mb-4 flex">
                <input
                  type="text"
                  className="input-field flex-grow"
                  placeholder="Add a skill (e.g., JavaScript, Project Management)"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary ml-2"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </form>
              
              {userData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill, index) => (
                    <div 
                      key={index} 
                      className="bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-full px-3 py-1.5 text-sm flex items-center"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(index)}
                        className="ml-2 text-surface-500 hover:text-accent"
                        aria-label="Remove skill"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 border border-dashed border-surface-300 dark:border-surface-700 rounded-lg">
                  <p className="text-surface-500 dark:text-surface-400">No skills added yet</p>
                </div>
              )}
            </div>
            
            {/* Certifications */}
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center text-surface-900 dark:text-white">
                <AwardIcon className="w-5 h-5 mr-2 text-primary" />
                Certifications
              </h3>
              
              {/* Certification Form */}
              <form onSubmit={addCertification} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="form-label">Certification Name *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="AWS Certified Solutions Architect"
                      value={certForm.name}
                      onChange={(e) => setCertForm({...certForm, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Issuing Organization *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Amazon Web Services"
                      value={certForm.issuer}
                      onChange={(e) => setCertForm({...certForm, issuer: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={certForm.date}
                      onChange={(e) => setCertForm({...certForm, date: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="form-label">Description</label>
                  <textarea
                    className="input-field min-h-20"
                    placeholder="Brief description of the certification..."
                    value={certForm.description}
                    onChange={(e) => setCertForm({...certForm, description: e.target.value})}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingCert ? 'Update Certification' : 'Add Certification'}
                  </button>
                  
                  {editingCert && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={cancelEditCert}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
              
              {/* Certification List */}
              {userData.certifications.length > 0 ? (
                <div className="space-y-4">
                  {userData.certifications.map((cert) => (
                    <div key={cert.id} className="border border-surface-200 dark:border-surface-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-surface-900 dark:text-white">{cert.name}</h4>
                          <p className="text-surface-600 dark:text-surface-400">{cert.issuer}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditCert(cert)}
                            className="p-1.5 text-surface-500 hover:text-primary"
                            aria-label="Edit certification"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCert(cert.id)}
                            className="p-1.5 text-surface-500 hover:text-accent"
                            aria-label="Delete certification"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {cert.date && (
                        <div className="text-sm text-surface-500 dark:text-surface-400 mb-2">
                          {format(new Date(cert.date), 'MMMM yyyy')}
                        </div>
                      )}
                      
                      {cert.description && (
                        <p className="text-sm text-surface-700 dark:text-surface-300 mt-2">
                          {cert.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 border border-dashed border-surface-300 dark:border-surface-700 rounded-lg">
                  <p className="text-surface-500 dark:text-surface-400">No certifications added yet</p>
                </div>
              )}
            </div>
          </motion.div>
        );
        
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
                Preview Your Resume
              </h2>
              
              <button
                onClick={downloadResume}
                className="btn btn-primary flex items-center"
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Download PDF
              </button>
            </div>
            
            {/* Resume Preview */}
            <div className="bg-white shadow-lg rounded-lg border border-surface-200 mx-auto max-w-4xl mb-8">
              <div className="p-1 md:p-4">
                {selectedTemplate && (
                  <div className="bg-white" ref={resumeRef}>
                    {/* Render different templates based on selectedTemplate.id */}
                    {selectedTemplate.id === 'modern' && (
                      <div className="p-8 pb-12 max-w-full mx-auto">
                        {/* Header */}
                        <div className="border-b-4 border-primary pb-4 mb-6">
                          <h1 className="text-3xl font-bold text-surface-900">{userData.personalInfo.name || 'Your Name'}</h1>
                          
                          {/* Contact Info */}
                          <div className="flex flex-wrap gap-3 mt-2 text-surface-600 text-sm">
                            {userData.personalInfo.email && (
                              <div className="flex items-center">
                                <MailIcon className="w-4 h-4 mr-1" />
                                {userData.personalInfo.email}
                              </div>
                            )}
                            
                            {userData.personalInfo.phone && (
                              <div className="flex items-center">
                                <PhoneIcon className="w-4 h-4 mr-1" />
                                {userData.personalInfo.phone}
                              </div>
                            )}
                            
                            {userData.personalInfo.address && (
                              <div className="flex items-center">
                                <MapPinIcon className="w-4 h-4 mr-1" />
                                {userData.personalInfo.address}
                              </div>
                            )}
                            
                            {userData.personalInfo.linkedIn && (
                              <div className="flex items-center">
                                <LinkedinIcon className="w-4 h-4 mr-1" />
                                {userData.personalInfo.linkedIn}
                              </div>
                            )}
                            
                            {userData.personalInfo.website && (
                              <div className="flex items-center">
                                <GlobeIcon className="w-4 h-4 mr-1" />
                                {userData.personalInfo.website}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Summary */}
                        {userData.professionalSummary && (
                          <div className="mb-6">
                            <h2 className="text-lg font-bold text-primary mb-2">Professional Summary</h2>
                            <p className="text-surface-700">{userData.professionalSummary}</p>
                          </div>
                        )}
                        
                        {/* Work Experience */}
                        {userData.workExperience.length > 0 && (
                          <div className="mb-6">
                            <h2 className="text-lg font-bold text-primary mb-3">Work Experience</h2>
                            {userData.workExperience.map((work) => (
                              <div key={work.id} className="mb-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold text-surface-900">{work.jobTitle}</h3>
                                    <p className="text-surface-700">{work.company}</p>
                                  </div>
                                  <div className="text-sm text-surface-600">
                                    {work.startDate && (
                                      <>
                                        {format(new Date(work.startDate), 'MMM yyyy')}
                                        {work.endDate ? ` - ${format(new Date(work.endDate), 'MMM yyyy')}` : ' - Present'}
                                      </>
                                    )}
                                  </div>
                                </div>
                                {work.location && (
                                  <p className="text-sm text-surface-600 italic mb-1">{work.location}</p>
                                )}
                                {work.description && (
                                  <p className="text-sm text-surface-700 mt-1">{work.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Education */}
                        {userData.education.length > 0 && (
                          <div className="mb-6">
                            <h2 className="text-lg font-bold text-primary mb-3">Education</h2>
                            {userData.education.map((edu) => (
                              <div key={edu.id} className="mb-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold text-surface-900">{edu.degree}</h3>
                                    <p className="text-surface-700">{edu.institution}</p>
                                  </div>
                                  <div className="text-sm text-surface-600">
                                    {edu.startDate && (
                                      <>
                                        {format(new Date(edu.startDate), 'MMM yyyy')}
                                        {edu.endDate ? ` - ${format(new Date(edu.endDate), 'MMM yyyy')}` : ' - Present'}
                                      </>
                                    )}
                                  </div>
                                </div>
                                {edu.location && (
                                  <p className="text-sm text-surface-600 italic mb-1">{edu.location}</p>
                                )}
                                {edu.description && (
                                  <p className="text-sm text-surface-700 mt-1">{edu.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Skills */}
                        {userData.skills.length > 0 && (
                          <div className="mb-6">
                            <h2 className="text-lg font-bold text-primary mb-3">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                              {userData.skills.map((skill, index) => (
                                <span 
                                  key={index} 
                                  className="bg-surface-100 text-surface-700 rounded-full px-3 py-1 text-sm"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Certifications */}
                        {userData.certifications.length > 0 && (
                          <div>
                            <h2 className="text-lg font-bold text-primary mb-3">Certifications</h2>
                            {userData.certifications.map((cert) => (
                              <div key={cert.id} className="mb-3">
                                <h3 className="font-semibold text-surface-900">{cert.name}</h3>
                                <p className="text-surface-700">{cert.issuer}</p>
                                {cert.date && (
                                  <p className="text-sm text-surface-600 mt-1">
                                    {format(new Date(cert.date), 'MMMM yyyy')}
                                  </p>
                                )}
                                {cert.description && (
                                  <p className="text-sm text-surface-700 mt-1">{cert.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {selectedTemplate.id === 'minimal' && (
                      <div className="p-8 pb-12 max-w-full mx-auto">
                        {/* Header */}
                        <div className="text-center mb-8">
                          <h1 className="text-3xl font-bold text-surface-900 mb-2">{userData.personalInfo.name || 'Your Name'}</h1>
                          
                          {/* Contact Info */}
                          <div className="flex flex-wrap justify-center gap-4 text-surface-600 text-sm">
                            {userData.personalInfo.email && (
                              <div className="flex items-center">
                                <MailIcon className="w-4 h-4 mr-1" />
                                {userData.personalInfo.email}
                              </div>
                            )}
                            
                            {userData.personalInfo.phone && (
                              <div className="flex items-center">
                                <PhoneIcon className="w-4 h-4 mr-1" />
                                {userData.personalInfo.phone}
                              </div>
                            )}
                            
                            {userData.personalInfo.address && (
                              <div className="flex items-center">
                                <MapPinIcon className="w-4 h-4 mr-1" />
                                {userData.personalInfo.address}
                              </div>
                            )}
                            
                            {userData.personalInfo.linkedIn && (
                              <div className="flex items-center">
                                <LinkedinIcon className="w-4 h-4 mr-1" />
                                {userData.personalInfo.linkedIn}
                              </div>
                            )}
                            
                            {userData.personalInfo.website && (
                              <div className="flex items-center">
                                <GlobeIcon className="w-4 h-4 mr-1" />
                                {userData.personalInfo.website}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Summary */}
                        {userData.professionalSummary && (
                          <div className="mb-6">
                            <h2 className="text-md uppercase tracking-wider text-surface-500 mb-2 border-b border-surface-200 pb-1">Professional Summary</h2>
                            <p className="text-surface-700">{userData.professionalSummary}</p>
                          </div>
                        )}
                        
                        {/* Work Experience */}
                        {userData.workExperience.length > 0 && (
                          <div className="mb-6">
                            <h2 className="text-md uppercase tracking-wider text-surface-500 mb-3 border-b border-surface-200 pb-1">Work Experience</h2>
                            {userData.workExperience.map((work) => (
                              <div key={work.id} className="mb-4">
                                <h3 className="font-semibold text-surface-800">{work.jobTitle}</h3>
                                <div className="flex justify-between items-center text-surface-600 text-sm mb-1">
                                  <span>{work.company}{work.location ? `, ${work.location}` : ''}</span>
                                  {work.startDate && (
                                    <span>
                                      {format(new Date(work.startDate), 'MMM yyyy')}
                                      {work.endDate ? ` - ${format(new Date(work.endDate), 'MMM yyyy')}` : ' - Present'}
                                    </span>
                                  )}
                                </div>
                                {work.description && (
                                  <p className="text-sm text-surface-700 mt-1">{work.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Education */}
                        {userData.education.length > 0 && (
                          <div className="mb-6">
                            <h2 className="text-md uppercase tracking-wider text-surface-500 mb-3 border-b border-surface-200 pb-1">Education</h2>
                            {userData.education.map((edu) => (
                              <div key={edu.id} className="mb-4">
                                <h3 className="font-semibold text-surface-800">{edu.degree}</h3>
                                <div className="flex justify-between items-center text-surface-600 text-sm mb-1">
                                  <span>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</span>
                                  {edu.startDate && (
                                    <span>
                                      {format(new Date(edu.startDate), 'MMM yyyy')}
                                      {edu.endDate ? ` - ${format(new Date(edu.endDate), 'MMM yyyy')}` : ' - Present'}
                                    </span>
                                  )}
                                </div>
                                {edu.description && (
                                  <p className="text-sm text-surface-700 mt-1">{edu.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Two column layout for Skills and Certifications */}
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Skills */}
                          {userData.skills.length > 0 && (
                            <div className="flex-1">
                              <h2 className="text-md uppercase tracking-wider text-surface-500 mb-3 border-b border-surface-200 pb-1">Skills</h2>
                              <ul className="list-disc list-inside">
                                {userData.skills.map((skill, index) => (
                                  <li key={index} className="text-surface-700 mb-1">{skill}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Certifications */}
                          {userData.certifications.length > 0 && (
                            <div className="flex-1">
                              <h2 className="text-md uppercase tracking-wider text-surface-500 mb-3 border-b border-surface-200 pb-1">Certifications</h2>
                              {userData.certifications.map((cert) => (
                                <div key={cert.id} className="mb-3">
                                  <h3 className="font-semibold text-surface-800">{cert.name}</h3>
                                  <div className="text-surface-600 text-sm">
                                    {cert.issuer}
                                    {cert.date && (
                                      <span className="ml-2">
                                        ({format(new Date(cert.date), 'MMMM yyyy')})
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {selectedTemplate.id === 'creative' && (
                      <div className="mx-auto relative">
                        {/* Header with Accent Color */}
                        <div className="bg-purple-600 text-white p-8">
                          <h1 className="text-3xl md:text-4xl font-bold mb-1">{userData.personalInfo.name || 'Your Name'}</h1>
                          
                          {/* Contact Info */}
                          <div className="flex flex-wrap gap-4 mt-4 text-white/90 text-sm">
                            <div className="flex items-center space-x-6">
                              {userData.personalInfo.email && (
                                <div className="flex items-center">
                                  <MailIcon className="w-4 h-4 mr-1.5" />
                                  {userData.personalInfo.email}
                                </div>
                              )}
                              
                              {userData.personalInfo.phone && (
                                <div className="flex items-center">
                                  <PhoneIcon className="w-4 h-4 mr-1.5" />
                                  {userData.personalInfo.phone}
                                </div>
                              )}
                              
                              {userData.personalInfo.address && (
                                <div className="flex items-center">
                                  <MapPinIcon className="w-4 h-4 mr-1.5" />
                                  {userData.personalInfo.address}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-6">
                              {userData.personalInfo.linkedIn && (
                                <div className="flex items-center">
                                  <LinkedinIcon className="w-4 h-4 mr-1.5" />
                                  {userData.personalInfo.linkedIn}
                                </div>
                              )}
                              
                              {userData.personalInfo.website && (
                                <div className="flex items-center">
                                  <GlobeIcon className="w-4 h-4 mr-1.5" />
                                  {userData.personalInfo.website}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Main Content */}
                        <div className="p-8">
                          {/* Summary */}
                          {userData.professionalSummary && (
                            <div className="mb-8">
                              <h2 className="text-xl font-bold text-purple-600 mb-3 flex items-center">
                                <UserIcon className="w-5 h-5 mr-2" />
                                About Me
                              </h2>
                              <p className="text-surface-700 leading-relaxed">{userData.professionalSummary}</p>
                            </div>
                          )}
                          
                          {/* Work Experience */}
                          {userData.workExperience.length > 0 && (
                            <div className="mb-8">
                              <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center">
                                <BriefcaseIcon className="w-5 h-5 mr-2" />
                                Work Experience
                              </h2>
                              
                              <div className="space-y-6">
                                {userData.workExperience.map((work) => (
                                  <div key={work.id} className="relative pl-6 border-l-2 border-purple-200">
                                    <div className="absolute left-[-8px] top-0 w-3.5 h-3.5 bg-purple-600 rounded-full"></div>
                                    <h3 className="font-bold text-lg text-surface-800">{work.jobTitle}</h3>
                                    <p className="font-medium text-purple-600 mb-1">{work.company}</p>
                                    <div className="flex items-center text-surface-500 text-sm mb-2">
                                      {work.location && (
                                        <span className="flex items-center mr-4">
                                          <MapPinIcon className="w-3.5 h-3.5 mr-1" />
                                          {work.location}
                                        </span>
                                      )}
                                      
                                      {work.startDate && (
                                        <span>
                                          {format(new Date(work.startDate), 'MMM yyyy')}
                                          {work.endDate ? ` - ${format(new Date(work.endDate), 'MMM yyyy')}` : ' - Present'}
                                        </span>
                                      )}
                                    </div>
                                    {work.description && (
                                      <p className="text-surface-700">{work.description}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Education */}
                          {userData.education.length > 0 && (
                            <div className="mb-8">
                              <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center">
                                <GraduationCapIcon className="w-5 h-5 mr-2" />
                                Education
                              </h2>
                              
                              <div className="space-y-5">
                                {userData.education.map((edu) => (
                                  <div key={edu.id} className="relative pl-6 border-l-2 border-purple-200">
                                    <div className="absolute left-[-8px] top-0 w-3.5 h-3.5 bg-purple-600 rounded-full"></div>
                                    <h3 className="font-bold text-lg text-surface-800">{edu.degree}</h3>
                                    <p className="font-medium text-purple-600 mb-1">{edu.institution}</p>
                                    <div className="flex items-center text-surface-500 text-sm mb-2">
                                      {edu.location && (
                                        <span className="flex items-center mr-4">
                                          <MapPinIcon className="w-3.5 h-3.5 mr-1" />
                                          {edu.location}
                                        </span>
                                      )}
                                      
                                      {edu.startDate && (
                                        <span>
                                          {format(new Date(edu.startDate), 'MMM yyyy')}
                                          {edu.endDate ? ` - ${format(new Date(edu.endDate), 'MMM yyyy')}` : ' - Present'}
                                        </span>
                                      )}
                                    </div>
                                    {edu.description && (
                                      <p className="text-surface-700">{edu.description}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Two column layout for Skills and Certifications */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Skills */}
                            {userData.skills.length > 0 && (
                              <div>
                                <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center">
                                  <AwardIcon className="w-5 h-5 mr-2" />
                                  Skills
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                  {userData.skills.map((skill, index) => (
                                    <span 
                                      key={index} 
                                      className="bg-purple-100 text-purple-700 rounded-full px-4 py-1.5 text-sm"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Certifications */}
                            {userData.certifications.length > 0 && (
                              <div>
                                <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center">
                                  <AwardIcon className="w-5 h-5 mr-2" />
                                  Certifications
                                </h2>
                                {userData.certifications.map((cert) => (
                                  <div key={cert.id} className="mb-3">
                                    <h3 className="font-semibold text-surface-800">{cert.name}</h3>
                                    <p className="text-surface-600">{cert.issuer}</p>
                                    {cert.date && (
                                      <p className="text-sm text-surface-500 mt-1">
                                        {format(new Date(cert.date), 'MMMM yyyy')}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedTemplate.id === 'professional' && (
                      <div className="p-8 pb-12 max-w-full mx-auto">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start mb-8 pb-4 border-b-2 border-gray-700">
                          <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-1">{userData.personalInfo.name || 'Your Name'}</h1>
                          </div>
                          
                          {/* Contact Info */}
                          <div className="mt-3 md:mt-0 text-right flex flex-col items-end">
                            {userData.personalInfo.email && (
                              <div className="text-surface-700 mb-1">
                                {userData.personalInfo.email}
                              </div>
                            )}
                            
                            {userData.personalInfo.phone && (
                              <div className="text-surface-700 mb-1">
                                {userData.personalInfo.phone}
                              </div>
                            )}
                            
                            {userData.personalInfo.address && (
                              <div className="text-surface-700 mb-1">
                                {userData.personalInfo.address}
                              </div>
                            )}
                            
                            {userData.personalInfo.linkedIn && (
                              <div className="text-surface-700 mb-1">
                                {userData.personalInfo.linkedIn}
                              </div>
                            )}
                            
                            {userData.personalInfo.website && (
                              <div className="text-surface-700">
                                {userData.personalInfo.website}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Summary */}
                        {userData.professionalSummary && (
                          <div className="mb-8">
                            <h2 className="text-lg font-bold uppercase text-gray-800 mb-3 border-b border-gray-300 pb-1">Professional Summary</h2>
                            <p className="text-surface-700">{userData.professionalSummary}</p>
                          </div>
                        )}
                        
                        {/* Work Experience */}
                        {userData.workExperience.length > 0 && (
                          <div className="mb-8">
                            <h2 className="text-lg font-bold uppercase text-gray-800 mb-4 border-b border-gray-300 pb-1">Experience</h2>
                            {userData.workExperience.map((work) => (
                              <div key={work.id} className="mb-5">
                                <div className="flex flex-col md:flex-row justify-between mb-1">
                                  <h3 className="font-bold text-surface-800">{work.jobTitle}</h3>
                                  {work.startDate && (
                                    <div className="text-surface-600 text-sm">
                                      {format(new Date(work.startDate), 'MMMM yyyy')}
                                      {work.endDate ? ` - ${format(new Date(work.endDate), 'MMMM yyyy')}` : ' - Present'}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col md:flex-row justify-between mb-2">
                                  <p className="font-medium text-surface-700">{work.company}</p>
                                  {work.location && (
                                    <div className="text-surface-600 text-sm">
                                      {work.location}
                                    </div>
                                  )}
                                </div>
                                {work.description && (
                                  <p className="text-surface-700 text-sm">{work.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Education */}
                        {userData.education.length > 0 && (
                          <div className="mb-8">
                            <h2 className="text-lg font-bold uppercase text-gray-800 mb-4 border-b border-gray-300 pb-1">Education</h2>
                            {userData.education.map((edu) => (
                              <div key={edu.id} className="mb-5">
                                <div className="flex flex-col md:flex-row justify-between mb-1">
                                  <h3 className="font-bold text-surface-800">{edu.degree}</h3>
                                  {edu.startDate && (
                                    <div className="text-surface-600 text-sm">
                                      {format(new Date(edu.startDate), 'MMMM yyyy')}
                                      {edu.endDate ? ` - ${format(new Date(edu.endDate), 'MMMM yyyy')}` : ' - Present'}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col md:flex-row justify-between mb-2">
                                  <p className="font-medium text-surface-700">{edu.institution}</p>
                                  {edu.location && (
                                    <div className="text-surface-600 text-sm">
                                      {edu.location}
                                    </div>
                                  )}
                                </div>
                                {edu.description && (
                                  <p className="text-surface-700 text-sm">{edu.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Skills and Certifications */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Skills */}
                          {userData.skills.length > 0 && (
                            <div>
                              <h2 className="text-lg font-bold uppercase text-gray-800 mb-3 border-b border-gray-300 pb-1">Skills</h2>
                              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                {userData.skills.map((skill, index) => (
                                  <div key={index} className="text-surface-700">• {skill}</div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Certifications */}
                          {userData.certifications.length > 0 && (
                            <div>
                              <h2 className="text-lg font-bold uppercase text-gray-800 mb-3 border-b border-gray-300 pb-1">Certifications</h2>
                              {userData.certifications.map((cert) => (
                                <div key={cert.id} className="mb-3">
                                  <div className="flex flex-col md:flex-row justify-between mb-1">
                                    <h3 className="font-semibold text-surface-800">{cert.name}</h3>
                                    {cert.date && (
                                      <div className="text-surface-600 text-sm">
                                        {format(new Date(cert.date), 'MMMM yyyy')}
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-surface-700">{cert.issuer}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-surface-600 dark:text-surface-400 mb-8">
                Use the download button to save your resume as a PDF. You can then print it or attach it to job applications.
              </p>
              
              <button
                onClick={downloadResume}
                className="btn btn-primary mx-auto flex items-center px-8 py-3"
              >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Download Resume
              </button>
            </div>
          </motion.div>
        );
        
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div>
      {renderStepContent()}
    </div>
  );
};

export default MainFeature;