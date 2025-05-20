import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import { getIcon } from '../utils/iconUtils';

// Import icons
const FileTextIcon = getIcon('file-text');
const LayoutTemplateIcon = getIcon('layout-template');
const EditIcon = getIcon('edit-3');
const EyeIcon = getIcon('eye');
const DownloadIcon = getIcon('download');
const ArrowLeftIcon = getIcon('arrow-left');
const ArrowRightIcon = getIcon('arrow-right');
const CheckIcon = getIcon('check-circle');

const Home = () => {
  const dispatch = useDispatch();
  const { currentStep, selectedTemplate } = useSelector(state => state.resume);
  
  // Function to handle step navigation
  const goToStep = (step) => {
    if (step === 2 && !selectedTemplate) {
      toast.error("Please select a template first");
      return;
    }
    
    dispatch({ type: 'SET_STEP', payload: step });
    
    // Scroll to top when changing steps
    window.scrollTo(0, 0);
  };

  // Step information
  const steps = [
    {
      id: 1,
      title: "Choose Template",
      description: "Select from our professional resume templates",
      icon: LayoutTemplateIcon
    },
    {
      id: 2,
      title: "Fill Details",
      description: "Enter your personal and professional information",
      icon: EditIcon
    },
    {
      id: 3,
      title: "Preview & Download",
      description: "Review your resume and download it",
      icon: DownloadIcon
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-container"
    >
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <FileTextIcon className="w-8 h-8 md:w-10 md:h-10" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-surface-900 dark:text-white">
          Create Your Professional Resume
        </h1>
        <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          Build a standout resume in minutes with our easy-to-use builder and professionally designed templates.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-10">
        <div className="hidden md:flex justify-between items-center max-w-4xl mx-auto relative">
          {/* Progress Line */}
          <div className="absolute h-1 bg-surface-200 dark:bg-surface-700 top-1/2 transform -translate-y-1/2 left-0 right-0 z-0">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-in-out"
              style={{ width: `${(currentStep - 1) * 50}%` }}
            />
          </div>
          
          {/* Step Circles */}
          {steps.map((step) => (
            <div 
              key={step.id}
              className="flex flex-col items-center relative z-10"
              onClick={() => step.id <= currentStep && goToStep(step.id)}
            >
              <div 
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-2
                  ${step.id <= currentStep 
                    ? 'bg-primary text-white' 
                    : 'bg-surface-200 dark:bg-surface-700 text-surface-400 dark:text-surface-500'}
                  ${step.id <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'}
                  transition-all duration-300
                `}
              >
                {step.id < currentStep ? (
                  <CheckIcon className="w-6 h-6" />
                ) : (
                  <step.icon className="w-6 h-6" />
                )}
              </div>
              <div className="text-center">
                <div className={`font-semibold ${step.id === currentStep ? 'text-primary' : 'text-surface-700 dark:text-surface-300'}`}>
                  {step.title}
                </div>
                <div className="text-sm text-surface-500 dark:text-surface-400 hidden lg:block">
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile Step Indicator */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${currentStep === 1 ? 'bg-primary text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-500'}`}>
                {/* Extract the icon component before using it in JSX */}
                {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5" })}
              </div>
              <div>
                <div className="font-semibold text-surface-900 dark:text-white">
                  Step {currentStep} of 3
                </div>
                <div className="text-sm text-surface-600 dark:text-surface-400">
                  {steps[currentStep - 1].title}
                </div>
              </div>
            </div>
            <div className="text-surface-400 dark:text-surface-500">
              {currentStep}/3
            </div>
          </div>
          <div className="h-2 w-full bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-in-out"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6 md:p-8 mb-8">
        <MainFeature currentStep={currentStep} />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        <button
          onClick={() => goToStep(currentStep - 1)}
          className={`btn ${currentStep === 1 ? 'invisible' : 'btn-outline'} flex items-center`}
          disabled={currentStep === 1}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Previous
        </button>
        
        <button
          onClick={() => goToStep(currentStep + 1)}
          className={`btn ${currentStep === 3 ? 'invisible' : 'btn-primary'} flex items-center`}
          disabled={currentStep === 3 || (currentStep === 1 && !selectedTemplate)}
        >
          {currentStep === 2 ? 'Preview Resume' : 'Next Step'}
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </button>
      </div>
    </motion.div>
  );
};

export default Home;