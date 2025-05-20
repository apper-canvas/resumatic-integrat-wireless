import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

// Create a simple reducer for resume data
const initialState = {
  selectedTemplate: null,
  userData: {
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      address: "",
      linkedIn: "",
      website: "",
      profileImage: ""
    },
    professionalSummary: "",
    workExperience: [],
    education: [],
    skills: [],
    certifications: []
  },
  currentStep: 1
}

function resumeReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_TEMPLATE':
      return { ...state, selectedTemplate: action.payload }
    case 'UPDATE_USER_DATA':
      return { 
        ...state,
        userData: {
          ...state.userData,
          ...action.payload
        }
      }
    case 'SET_STEP':
      return { ...state, currentStep: action.payload }
    case 'ADD_WORK_EXPERIENCE':
      return {
        ...state,
        userData: {
          ...state.userData,
          workExperience: [...state.userData.workExperience, action.payload]
        }
      }
    case 'UPDATE_WORK_EXPERIENCE':
      return {
        ...state,
        userData: {
          ...state.userData,
          workExperience: state.userData.workExperience.map(exp => 
            exp.id === action.payload.id ? action.payload : exp
          )
        }
      }
    case 'REMOVE_WORK_EXPERIENCE':
      return {
        ...state,
        userData: {
          ...state.userData,
          workExperience: state.userData.workExperience.filter(exp => exp.id !== action.payload)
        }
      }
    case 'ADD_EDUCATION':
      return {
        ...state,
        userData: {
          ...state.userData,
          education: [...state.userData.education, action.payload]
        }
      }
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        userData: {
          ...state.userData,
          education: state.userData.education.map(edu => 
            edu.id === action.payload.id ? action.payload : edu
          )
        }
      }
    case 'REMOVE_EDUCATION':
      return {
        ...state,
        userData: {
          ...state.userData,
          education: state.userData.education.filter(edu => edu.id !== action.payload)
        }
      }
    case 'UPDATE_SKILLS':
      return {
        ...state,
        userData: {
          ...state.userData,
          skills: action.payload
        }
      }
    case 'ADD_CERTIFICATION':
      return {
        ...state,
        userData: {
          ...state.userData,
          certifications: [...state.userData.certifications, action.payload]
        }
      }
    case 'UPDATE_CERTIFICATION':
      return {
        ...state,
        userData: {
          ...state.userData,
          certifications: state.userData.certifications.map(cert => 
            cert.id === action.payload.id ? action.payload : cert
          )
        }
      }
    case 'REMOVE_CERTIFICATION':
      return {
        ...state,
        userData: {
          ...state.userData,
          certifications: state.userData.certifications.filter(cert => cert.id !== action.payload)
        }
      }
    case 'UPDATE_PERSONAL_INFO':
      return {
        ...state,
        userData: {
          ...state.userData,
          personalInfo: {
            ...state.userData.personalInfo,
            ...action.payload
          }
        }
      }
    case 'UPDATE_PROFESSIONAL_SUMMARY':
      return {
        ...state,
        userData: {
          ...state.userData,
          professionalSummary: action.payload
        }
      }
    default:
      return state
  }
}

const store = configureStore({
  reducer: {
    resume: resumeReducer
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)