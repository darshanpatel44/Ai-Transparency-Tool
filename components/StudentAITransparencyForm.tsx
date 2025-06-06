"use client";

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateStudentCertificate } from '@/lib/generateStudentCertificate';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { DropdownChecklist } from '@/components/ui/dropdown-checklist';

interface FormData {
  studentId: string;
  studentName: string;
  assignmentTitle: string;
  courseCode: string;
  instructorName: string;
  aiTools: Array<{
    toolName: string;
    aiType: string;
    purpose: string[];
    settings: string;
  }>;
  additionalComments: string;
  declaration: boolean;
}

interface FormErrors {
  studentInfo: boolean;
  assignmentInfo: boolean;
  aiTools: boolean;
  aiToolsDetails: boolean[];
}

const aiToolOptions = [
    { value: 'chatgpt', label: 'ChatGPT (OpenAI)' },
    { value: 'gemini', label: 'Gemini (Google)' },
    { value: 'claude', label: 'Claude (Anthropic)' },
    { value: 'llama', label: 'Llama (Meta)' },
    { value: 'dalle', label: 'DALL·E (OpenAI)' },
    { value: 'midjourney', label: 'MidJourney' },
    { value: 'copilot', label: 'GitHub Copilot' },
    { value: 'bard', label: 'Bard (Google)' },
    { value: 'other', label: 'Other' }
  ];
  
  const aiTypeOptions = [
    { value: 'text-generation', label: 'Text Generation' },
    { value: 'code-generation', label: 'Code Generation' },
    { value: 'image-synthesis', label: 'Image Synthesis' },
    { value: 'music-generation', label: 'Music Synthesis' },
    { value: 'data-analysis', label: 'Data Analysis' },
    { value: 'video-generation', label: 'Video Synthesis' },
    { value: 'speech-synthesis', label: 'Speech Synthesis' },
    { value: 'other', label: 'Other' }
  ];
  
  const purposeOptions = [
    { value: 'writer_block', label: 'To get started or overcome writer\'s block' },
    { value: 'first_draft', label: 'To generate a first draft or outline for my assignment' },
    { value: 'improve_grammar', label: 'To improve or rephrase my writing for grammar, clarity, or tone' },
    { value: 'explore_ideas', label: 'To explore different perspectives or approaches to the topic' },
    { value: 'summarize', label: 'To help summarize or better understand complex readings or topics' },
    { value: 'create_media', label: 'To create or improve images, graphics, or other media for the assignment' },
    { value: 'coding_help', label: 'To help with coding or debugging tasks' },
    { value: 'citation_help', label: 'To generate citations or help with reference formatting' },
    { value: 'translation', label: 'To translate content or improve fluency in English or another language' },
    { value: 'study_guides', label: 'To create practice questions or study guides' },
    { value: 'specialized_gpt', label: 'To use a specialized GPT or AI assistant designed for a specific task' },
    { value: 'other', label: 'Other (please describe)' }
  ];

export default function StudentAITransparencyForm() {
  const [formData, setFormData] = useState<FormData>({
    studentId: '',
    studentName: '',
    assignmentTitle: '',
    courseCode: '',
    instructorName: '',
    aiTools: [{
      toolName: '',
      aiType: '',
      purpose: [],
      settings: ''
    }],
    additionalComments: '',
    declaration: false
  });
  
  const [errors, setErrors] = useState<FormErrors>({
    studentInfo: false,
    assignmentInfo: false,
    aiTools: false,
    aiToolsDetails: [false]
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAIToolChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newAiTools = [...prev.aiTools];
      newAiTools[index] = {
        ...newAiTools[index],
        [field]: value
      };
      return {
        ...prev,
        aiTools: newAiTools
      };
    });
  };
  
  const handlePurposeChange = (index: number, values: string[]) => {
    setFormData(prev => {
      const newAiTools = [...prev.aiTools];
      newAiTools[index] = {
        ...newAiTools[index],
        purpose: values
      };
      
      return {
        ...prev,
        aiTools: newAiTools
      };
    });
  };

  const addAITool = () => {
    setFormData(prev => ({
      ...prev,
      aiTools: [...prev.aiTools, { toolName: '', aiType: '', purpose: [], settings: '' }]
    }));
    
    setErrors(prev => ({
      ...prev,
      aiToolsDetails: [...prev.aiToolsDetails, false]
    }));
  };

  const removeAITool = (index: number) => {
    setFormData(prev => ({
      ...prev,
      aiTools: prev.aiTools.filter((_, i) => i !== index)
    }));
    
    setErrors(prev => ({
      ...prev,
      aiToolsDetails: prev.aiToolsDetails.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    setFormSubmitted(true);
    
    // Check student information
    const studentInfoValid = !!formData.studentId && !!formData.studentName;
    
    // Check assignment information
    const assignmentInfoValid = !!formData.assignmentTitle && !!formData.courseCode && !!formData.instructorName;
    
    // Check if at least one AI tool is properly filled
    const aiToolsDetailsValid = formData.aiTools.map(tool => 
      !!tool.toolName && !!tool.aiType && tool.purpose.length > 0
    );
    
    // Check if at least one AI tool is valid
    const atLeastOneAiToolValid = aiToolsDetailsValid.some(isValid => isValid);
    
    setErrors({
      studentInfo: !studentInfoValid,
      assignmentInfo: !assignmentInfoValid,
      aiTools: !atLeastOneAiToolValid,
      aiToolsDetails: aiToolsDetailsValid.map(isValid => !isValid)
    });
    
    return studentInfoValid && assignmentInfoValid && atLeastOneAiToolValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      if (errors.studentInfo) {
        document.getElementById('studentId')?.scrollIntoView({ behavior: 'smooth' });
      } else if (errors.assignmentInfo) {
        document.getElementById('assignmentTitle')?.scrollIntoView({ behavior: 'smooth' });
      } else if (errors.aiTools) {
        document.querySelector('.ai-tools-section')?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    
    const timestamp = new Date().toLocaleString();
    const submissionId = `${formData.studentId}-${Date.now()}`;
    
    generateStudentCertificate({
      studentId: formData.studentId,
      studentName: formData.studentName,
      assignmentTitle: formData.assignmentTitle,
      courseCode: formData.courseCode,
      instructorName: formData.instructorName,
      aiTools: formData.aiTools,
      additionalComments: formData.additionalComments,
      submissionId,
      timestamp
    });
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-r from-[#0055A2] via-[#939597] to-[#E5A823] flex items-center justify-center p-4"
      role="region"
      aria-labelledby="form-title"
    >
      <Card className="max-w-4xl mx-auto shadow-xl border-t-4 border-t-[#0055A2] rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white pb-6 border-b">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Image 
                src="/images/sjsu_logo.png" 
                alt="SJSU Logo" 
                width={120} 
                height={24} 
                className="object-contain" 
              />
            </div>
            <div>
              <CardTitle id="form-title" className="text-2xl font-bold text-[#0055A2]">SAID — Student AI Disclosure</CardTitle>
              <p className="text-gray-600 mt-3">Document your use of AI tools for academic assignments</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8 px-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              
              {/* Informational Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">This tool empowers you to transparently document your use of AI tools in academic assignments. The <span className="font-bold">easy-to-use</span> templates and prompts guide you in disclosing how, when, and why AI was utilized, ensuring alignment with your instructor’s guidelines and institutional policies. Customize your disclosure with checkboxes, text fields, and optional reflections to clarify your process. Refer to <a href="https://docs.google.com/document/d/1XjSmMeGR98jHjyTyl4XawSxEgAQDPaDHKY-WP5f6QKw/edit?usp=sharing" className="text-blue-600 hover:underline">the SAID Guide</a> for tips on ethical AI use and best practices.</p>
                  </div>
                </div>
              </div>
              
        {/* Student Information */}
        <div className="mb-6">
          {errors.studentInfo && formSubmitted && (
            <Alert className="mb-4 border-red-400 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-600">Missing Information</AlertTitle>
              <AlertDescription className="text-red-600">
                Please fill in all required student information fields.
              </AlertDescription>
            </Alert>
          )}
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0055A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <h3 id="student-info-heading" className="text-lg font-semibold text-[#0055A2]">Student Information</h3>
          </div>
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white p-5 rounded-lg border border-[#E5E7EB] shadow-sm"
            role="group"
            aria-labelledby="student-info-heading"
          >
            <div className="space-y-2">
              <Label htmlFor="studentId" className="font-medium">Student ID <span className="text-red-500">*</span></Label>
              <Input
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                required
                aria-required="true"
                aria-invalid={errors.studentInfo && formSubmitted ? "true" : "false"}
                className="border-[#939597] focus:border-[#0055A2] focus:ring-[#0055A2] h-10 rounded-md focus-visible"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentName" className="font-medium">Full Name <span className="text-red-500">*</span></Label>
              <Input
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                required
                aria-required="true"
                aria-invalid={errors.studentInfo && formSubmitted ? "true" : "false"}
                className="border-[#939597] focus:border-[#0055A2] focus:ring-[#0055A2] h-10 rounded-md focus-visible"
              />
            </div>
          </div>
        </div>

        {/* Assignment Information */}
        <div className="mb-6">
          {errors.assignmentInfo && formSubmitted && (
            <Alert className="mb-4 border-red-400 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-600">Missing Information</AlertTitle>
              <AlertDescription className="text-red-600">
                Please fill in all required assignment information fields.
              </AlertDescription>
            </Alert>
          )}
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0055A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <h3 className="text-lg font-semibold text-[#0055A2]">Assignment Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-white p-5 rounded-lg border border-[#E5E7EB] shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="assignmentTitle" className="font-medium">Assignment Title <span className="text-red-500">*</span></Label>
              <Input
                id="assignmentTitle"
                name="assignmentTitle"
                value={formData.assignmentTitle}
                onChange={handleInputChange}
                required
                className="border-[#939597] focus:border-[#0055A2] focus:ring-[#0055A2] h-10 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseCode" className="font-medium">Course Code <span className="text-red-500">*</span></Label>
              <Input
                id="courseCode"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleInputChange}
                required
                className="border-[#939597] focus:border-[#0055A2] focus:ring-[#0055A2] h-10 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructorName" className="font-medium">Instructor Name <span className="text-red-500">*</span></Label>
              <Input
                id="instructorName"
                name="instructorName"
                value={formData.instructorName}
                onChange={handleInputChange}
                required
                className="border-[#939597] focus:border-[#0055A2] focus:ring-[#0055A2] h-10 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* AI Tools Section */}
        <div className="space-y-6 ai-tools-section">
          {errors.aiTools && formSubmitted && (
            <Alert className="mb-4 border-red-400 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-600">AI Tool Required</AlertTitle>
              <AlertDescription className="text-red-600">
                Please add at least one AI tool with all required fields filled.
              </AlertDescription>
            </Alert>
          )}
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0055A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2c1.1 0 2 .9 2 2v7c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2z"></path>
              <path d="M12 9v3"></path>
              <path d="M12 17h0"></path>
              <path d="M20 20a8 8 0 1 0-16 0"></path>
              <path d="M17 14l-5 5"></path>
              <path d="M12 19l-5-5"></path>
            </svg>
            <Label className="text-lg font-semibold text-[#0055A2]">AI Tools Used</Label>
          </div>
          
          {formData.aiTools.map((tool, index) => (
            <div key={index} className={`p-6 border ${errors.aiToolsDetails[index] && formSubmitted ? 'border-red-400' : 'border-[#E5E7EB]'} rounded-lg space-y-5 bg-white shadow-md hover:shadow-lg transition-all`}>
              <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3 mb-2">
                <h3 className="font-medium text-[#0055A2]">{`AI Tool ${index + 1}`}</h3>
                {formData.aiTools.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300 font-medium text-xs px-3 py-1 rounded-full transition-all"
                    onClick={() => removeAITool(index)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    Remove
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="font-medium">Tool Name <span className="text-red-500">*</span></Label>
                  <Select
                    value={tool.toolName}
                    onValueChange={(value) => handleAIToolChange(index, 'toolName', value)}
                    required
                  >
                    <SelectTrigger className="w-full border-[#939597] focus:border-[#0055A2] focus:ring-[#0055A2] h-10 rounded-md">
                      <SelectValue placeholder="Select Tool" />
                    </SelectTrigger>
                    <SelectContent>
                      {aiToolOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">AI Type <span className="text-red-500">*</span></Label>
                  <Select
                    value={tool.aiType}
                    onValueChange={(value) => handleAIToolChange(index, 'aiType', value)}
                    required
                  >
                    <SelectTrigger className="w-full border-[#939597] focus:border-[#0055A2] focus:ring-[#0055A2] h-10 rounded-md">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {aiTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="font-medium">What were you trying to achieve with AI use? (Select all that apply) <span className="text-red-500">*</span></Label>
                  <DropdownChecklist
                    options={purposeOptions}
                    selectedValues={tool.purpose}
                    onChange={(values) => handlePurposeChange(index, values)}
                    placeholder="Select purposes"
                    className="border border-[#939597] rounded-md"
                  />
                  {(tool.purpose.length === 0 && formSubmitted && errors.aiToolsDetails[index]) && (
                    <p className="text-red-500 text-xs mt-1">Please select at least one purpose</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">Custom Settings/Chat history Links <span className="text-gray-500 text-sm font-normal">(Optional)</span></Label>
                  <Textarea
                    value={tool.settings}
                    onChange={(e) => handleAIToolChange(index, 'settings', e.target.value)}
                    placeholder="Share any specific settings or chat history links used..."
                    className="min-h-[80px] resize-y border-[#939597] focus:border-[#0055A2] focus:ring-[#0055A2] rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            className="bg-[#FFD700] hover:bg-yellow-500 text-[#0055A2] font-semibold px-5 py-3 rounded-md shadow hover:shadow-md transition-all flex items-center justify-center gap-2 w-full border-[#0055A2] border mt-2"
            onClick={addAITool}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Another AI Tool
          </Button>
        </div>



        {/* Additional Comments Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0055A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <h3 className="text-lg font-semibold text-[#0055A2]">Additional Comments</h3>
          </div>
          <div className="bg-white p-5 rounded-lg border border-[#E5E7EB] shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="additionalComments" className="font-medium">Context or Explanations <span className="text-gray-500 text-sm font-normal">(Optional)</span></Label>
              <Textarea
                id="additionalComments"
                name="additionalComments"
                value={formData.additionalComments}
                onChange={handleInputChange}
                placeholder="Add any additional context or explanations about your AI tool usage..."
                className="min-h-[120px] resize-y border-[#939597] focus:border-[#0055A2] focus:ring-[#0055A2] rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Declaration */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-[#0055A2] mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-[#0055A2] font-semibold text-base mb-3">Declaration</h4>
              <div className="flex items-start gap-3 mt-2">
                <Checkbox
                  id="declaration"
                  checked={formData.declaration}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, declaration: checked as boolean }))
                  }
                  className="border-[#0055A2] text-[#0055A2] mt-0.5"
                  required
                />
                <Label htmlFor="declaration" className="text-sm leading-relaxed">
                  I confirm that all AI tools listed above were used ethically and in compliance with San Jose State University's academic integrity policy. I understand that this declaration will be included with my submission.
                </Label>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#0055A2] hover:bg-[#003D73] text-white font-semibold py-6 text-lg rounded-md shadow-md hover:shadow-lg transition-all mt-4"
          disabled={!formData.declaration}
        >
          Generate Certificate
        </Button>
        
        <div className="mt-6 bg-gray-100 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-700 mb-3">
            Help us improve the SAID by reporting any issues you encounter.
          </p>
          <Button
            variant="outline"
            className="border-[#E5A823] text-[#E5A823] hover:bg-[#E5A823]/10"
            onClick={() => window.open('https://forms.gle/7SvKBwvkXfNo4UMh9', '_blank')}
          >
            Report an issue
          </Button>
        </div>
      </div>
    </form>
        </CardContent>
      </Card>
    </div>
  );
}