import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload, FileText, CheckCircle } from 'lucide-react';

const SubmitClaim = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      claimAmount: '',
      description: ''
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds the 5MB limit.');
        return;
      }
      
      // Validate file type
      const allowedExtensions = /\.(pdf|jpg|jpeg|png)$/i;
      if (!allowedExtensions.test(file.name)) {
        toast.error('Only document files (PDF, JPG, JPEG, PNG) are allowed.');
        return;
      }

      setSelectedFile(file);
      setValue('document', file, { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    if (!selectedFile) {
      toast.error('Please upload a supporting document');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('claimAmount', data.claimAmount);
    formData.append('description', data.description);
    formData.append('document', selectedFile);

    try {
      await API.post('/claims', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Claim submitted successfully!');
      navigate('/patient/dashboard');
    } catch (err) {
      toast.error(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 min-h-[calc(100vh-64px)]">
      <div className="mx-auto max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/patient/dashboard')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 m-0">Submit Insurance Claim</h1>
          <p className="text-sm text-slate-500 mt-1">Please fill in the claim details and attach the receipts/reports.</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Claimant Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Claimant Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Claimant name is required' })}
                className={`w-full px-3 py-2 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 ${
                  errors.name ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/25' : 'border-slate-300 focus:border-blue-500'
                }`}
                placeholder="Enter patient full name"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-rose-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: 'Please enter a valid email address'
                  }
                })}
                className={`w-full px-3 py-2 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 ${
                  errors.email ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/25' : 'border-slate-300 focus:border-blue-500'
                }`}
                placeholder="patient@example.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600">{errors.email.message}</p>
              )}
            </div>

            {/* Claim Amount */}
            <div>
              <label htmlFor="claimAmount" className="block text-sm font-medium text-slate-700 mb-2">
                Claim Amount (USD)
              </label>
              <input
                id="claimAmount"
                type="number"
                step="0.01"
                {...register('claimAmount', {
                  required: 'Claim amount is required',
                  validate: {
                    positive: (value) => parseFloat(value) > 0 || 'Claim amount must be greater than zero'
                  }
                })}
                className={`w-full px-3 py-2 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 ${
                  errors.claimAmount ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/25' : 'border-slate-300 focus:border-blue-500'
                }`}
                placeholder="0.00"
              />
              {errors.claimAmount && (
                <p className="mt-1.5 text-xs text-rose-600">{errors.claimAmount.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Claim Description / Medical Reason
              </label>
              <textarea
                id="description"
                rows={4}
                {...register('description', {
                  required: 'Please add a medical description',
                  minLength: { value: 10, message: 'Description must be at least 10 characters' }
                })}
                className={`w-full px-3 py-2 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 ${
                  errors.description ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/25' : 'border-slate-300 focus:border-blue-500'
                }`}
                placeholder="Briefly describe the symptoms, treatments, or medicines this claim covers..."
              />
              {errors.description && (
                <p className="mt-1.5 text-xs text-rose-600">{errors.description.message}</p>
              )}
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload Supporting Document
              </label>
              <div className="flex justify-center rounded-xl border border-dashed border-slate-300 px-6 py-6 hover:bg-slate-50 transition-colors">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-slate-400" />
                  <div className="mt-4 flex text-sm text-slate-600">
                    <label
                      htmlFor="document-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="document-upload"
                        name="document-upload"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">PDF, JPG, JPEG, PNG up to 5MB</p>
                </div>
              </div>

              {selectedFile && (
                <div className="mt-3 flex items-center justify-between p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-700 truncate max-w-[200px] sm:max-w-xs">
                      {selectedFile.name}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:shadow-none transition-all cursor-pointer"
              >
                {submitting ? 'Submitting Application...' : 'Submit Claim Application'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitClaim;
