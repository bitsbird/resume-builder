'use client';

import { useState } from 'react';

import type { EditorEducation, EditorSkillSection, EditorWorkExperience } from './editor-types';

interface UseResumeEditorFormOptions {
  title?: string;
  targetRole?: string;
  targetCompany?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  workExperiences?: EditorWorkExperience[];
  skillSections?: EditorSkillSection[];
  education?: EditorEducation[];
}

export function useResumeEditorForm({
  title: initialTitle = '',
  targetRole: initialTargetRole = '',
  targetCompany: initialTargetCompany = '',
  name: initialName = '',
  email: initialEmail = '',
  phone: initialPhone = '',
  address: initialAddress = '',
  workExperiences: initialWorkExperiences = [],
  skillSections: initialSkillSections = [],
  education: initialEducation = [],
}: UseResumeEditorFormOptions = {}) {
  const [title, setTitle] = useState(initialTitle);
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [targetCompany, setTargetCompany] = useState(initialTargetCompany);
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [address, setAddress] = useState(initialAddress);
  const [workExperiences, setWorkExperiences] = useState<EditorWorkExperience[]>(initialWorkExperiences);
  const [skillSections, setSkillSections] = useState<EditorSkillSection[]>(initialSkillSections);
  const [education, setEducation] = useState<EditorEducation[]>(initialEducation);
  const [accomplishmentsToDelete, setAccomplishmentsToDelete] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  return {
    title,
    setTitle,
    targetRole,
    setTargetRole,
    targetCompany,
    setTargetCompany,
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    address,
    setAddress,
    workExperiences,
    setWorkExperiences,
    skillSections,
    setSkillSections,
    education,
    setEducation,
    accomplishmentsToDelete,
    setAccomplishmentsToDelete,
    error,
    setError,
  };
}
