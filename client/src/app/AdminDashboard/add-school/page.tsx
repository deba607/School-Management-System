'use client';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Building2, 
  Mail, 
  MapPin, 
  Phone, 
  Image, 
  CheckCircle2, 
  AlertCircle,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import AdminHeader from '../admin-header';
import AdminSidebar from '../admin-sidebar';

// Custom styles for file input
const fileInputStyles = `
  .file-input-custom::-webkit-file-upload-button {
    background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
    border: none;
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    margin-right: 0.75rem;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.75rem;
    transition: all 0.3s ease;
  }
  
  .file-input-custom::-webkit-file-upload-button:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
  }
  
  .file-input-custom::file-selector-button {
    background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
    border: none;
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    margin-right: 0.75rem;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.75rem;
    transition: all 0.3s ease;
  }
  
  .file-input-custom::file-selector-button:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
  }
  
  @media (min-width: 640px) {
    .file-input-custom::-webkit-file-upload-button {
      padding: 0.625rem 1rem;
      font-size: 0.875rem;
    }
    
    .file-input-custom::file-selector-button {
      padding: 0.625rem 1rem;
      font-size: 0.875rem;
    }
  }
`;

export default function AddSchool() {
  const [form, setForm] = useState({
    schoolId: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    address: '',
    phone: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    website: '',
    description: '',
  });
  const [pictures, setPictures] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Removed GSAP animations
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setPictures(files);
      const fileNames: string[] = [];
      for (let i = 0; i < files.length; i++) {
        fileNames.push(files[i].name);
      }
      setSelectedFiles(fileNames);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('schoolId', form.schoolId);
      formData.append('password', form.password);
      formData.append('confirmPassword', form.confirmPassword);
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('address', form.address);
      formData.append('phone', form.phone);
      formData.append('city', form.city);
      formData.append('state', form.state);
      formData.append('zipCode', form.zipCode);
      formData.append('country', form.country);
      formData.append('website', form.website);
      formData.append('description', form.description);

      if (pictures) {
        for (let i = 0; i < pictures.length; i++) {
          formData.append('pictures', pictures[i]);
        }
      }

      const response = await fetch('/api/schools', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create school');
      }

      if (result.success) {
        setSuccess(true);
        setForm({
          schoolId: '',
          password: '',
          confirmPassword: '',
          name: '',
          email: '',
          address: '',
          phone: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          website: '',
          description: '',
        });
        setPictures(null);
        setSelectedFiles([]);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to create school');
      }
    } catch (error: any) {
      console.error('Error creating school:', error);
      setError(error.message || 'Failed to create school');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <style dangerouslySetInnerHTML={{ __html: fileInputStyles }} />
      
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div
              ref={containerRef}
              className="relative"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-red-600/10 rounded-3xl blur-3xl" />
              
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-4 sm:p-6 lg:p-8 shadow-2xl">
                {/* Header */}
                <div
                  className="text-center mb-6 sm:mb-8"
                >
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4 sm:mb-6 shadow-lg"
                  >
                    <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  
                  <h1 
                    ref={titleRef}
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-2 sm:mb-4"
                  >
                    Add New School
                  </h1>
                  
                  <p className="text-slate-300 text-sm sm:text-base lg:text-lg">
                    Register a new school in the management system
                  </p>
                </div>

                {/* Success Message */}
                {success && (
                  <div
                    className="mb-6 bg-green-500/20 border border-green-400/30 rounded-xl p-4 flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                    <div>
                      <h3 className="text-green-300 font-semibold text-sm sm:text-base">Success!</h3>
                      <p className="text-green-200 text-xs sm:text-sm">School registered successfully.</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div
                    className="mb-6 bg-red-500/20 border border-red-400/30 rounded-xl p-4 flex items-center gap-3"
                  >
                    <AlertCircle className="w-6 h-6 text-red-400" />
                    <div>
                      <h3 className="text-red-300 font-semibold text-sm sm:text-base">Error!</h3>
                      <p className="text-red-200 text-xs sm:text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Basic Information Section */}
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                  >
                    {/* School Name */}
                    <div
                      className="form-field sm:col-span-2"
                    >
                      <Label htmlFor="name" className="text-white text-sm sm:text-base font-medium mb-2 block">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
                          <span>School Name</span>
                        </div>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter school name"
                        required
                        className="w-full bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl px-4 py-3 text-sm sm:text-base"
                      />
                    </div>

                    {/* Email */}
                    <div
                      className="form-field"
                    >
                      <Label htmlFor="email" className="text-white text-sm sm:text-base font-medium mb-2 block">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-pink-300" />
                          <span>Email Address</span>
                        </div>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter school email"
                        required
                        className="w-full bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl px-4 py-3 text-sm sm:text-base"
                      />
                    </div>

                    {/* Phone */}
                    <div
                      className="form-field"
                    >
                      <Label htmlFor="phone" className="text-white text-sm sm:text-base font-medium mb-2 block">
                        <div className="flex items-center gap-2 mb-2">
                          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
                          <span>Phone Number</span>
                        </div>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Enter school phone"
                        required
                        className="w-full bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl px-4 py-3 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  {/* Address Section */}
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                  >
                    {/* Address */}
                    <div
                      className="form-field sm:col-span-2"
                    >
                      <Label htmlFor="address" className="text-white text-sm sm:text-base font-medium mb-2 block">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                          <span>Address</span>
                        </div>
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Enter school address"
                        required
                        className="w-full bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl px-4 py-3 text-sm sm:text-base"
                      />
                    </div>

                    {/* City */}
                    <div
                      className="form-field"
                    >
                      <Label htmlFor="city" className="text-white text-sm sm:text-base font-medium mb-2 block">
                        <span>City</span>
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        required
                        className="w-full bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl px-4 py-3 text-sm sm:text-base"
                      />
                    </div>

                    {/* State */}
                    <div
                      className="form-field"
                    >
                      <Label htmlFor="state" className="text-white text-sm sm:text-base font-medium mb-2 block">
                        <span>State</span>
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        type="text"
                        value={form.state}
                        onChange={handleChange}
                        placeholder="Enter state"
                        required
                        className="w-full bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl px-4 py-3 text-sm sm:text-base"
                      />
                    </div>

                    {/* Zip Code */}
                    <div
                      className="form-field"
                    >
                      <Label htmlFor="zipCode" className="text-white text-sm sm:text-base font-medium mb-2 block">
                        <span>Zip Code</span>
                      </Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        value={form.zipCode}
                        onChange={handleChange}
                        placeholder="Enter zip code"
                        required
                        className="w-full bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl px-4 py-3 text-sm sm:text-base"
                      />
                    </div>

                    {/* Country */}
                    <div
                      className="form-field"
                    >
                      <Label htmlFor="country" className="text-white text-sm sm:text-base font-medium mb-2 block">
                        <span>Country</span>
                      </Label>
                      <Input
                        id="country"
                        name="country"
                        type="text"
                        value={form.country}
                        onChange={handleChange}
                        placeholder="Enter country"
                        required
                        className="w-full bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl px-4 py-3 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                  >
                    {/* Website */}
                    <div
                      className="form-field"
                    >
                      <Label htmlFor="website" className="text-white text-sm sm:text-base font-medium mb-2 block">
                        <span>Website (Optional)</span>
                      </Label>
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        value={form.website}
                        onChange={handleChange}
                        placeholder="Enter school website"
                        className="w-full bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl px-4 py-3 text-sm sm:text-base"
                      />
                    </div>

                    {/* Description */}
                    <div
                      className="form-field sm:col-span-2"
                    >
                      <Label htmlFor="description" className="text-white text-sm sm:text-base font-medium mb-2 block">
                        <span>Description (Optional)</span>
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Enter school description"
                        rows={3}
                        className="w-full bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl px-4 py-3 text-sm sm:text-base resize-none"
                      />
                    </div>
                  </div>

                  {/* School ID */}
                  <div
                    className="form-field"
                  >
                    <Label htmlFor="schoolId" className="text-white text-sm sm:text-base font-medium mb-2 block">
                      <span>School ID</span>
                    </Label>
                    <Input
                      id="schoolId"
                      name="schoolId"
                      type="text"
                      value={form.schoolId}
                      onChange={handleChange}
                      placeholder="Enter unique school ID"
                      required
                      className="w-full bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl px-4 py-3 text-sm sm:text-base"
                    />
                  </div>

                  {/* Password */}
                  <div
                    className="form-field"
                  >
                    <Label htmlFor="password" className="text-white text-sm sm:text-base font-medium mb-2 block">
                      <span>Password</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required
                        className="w-full bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl px-4 py-3 text-sm sm:text-base pr-12"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 bg-white/10 rounded p-1 shadow-sm focus:outline-none"
                        onClick={() => setShowPassword(v => !v)}
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div
                    className="form-field"
                  >
                    <Label htmlFor="confirmPassword" className="text-white text-sm sm:text-base font-medium mb-2 block">
                      <span>Confirm Password</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        required
                        className="w-full bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl px-4 py-3 text-sm sm:text-base pr-12"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 bg-white/10 rounded p-1 shadow-sm focus:outline-none"
                        onClick={() => setShowConfirmPassword(v => !v)}
                        tabIndex={-1}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Pictures Section */}
                  <div
                    className="form-field"
                  >
                    <Label htmlFor="pictures" className="text-white text-sm sm:text-base font-medium mb-2 block">
                      <div className="flex items-center gap-2 mb-2">
                        <Image className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
                        <span>School Pictures</span>
                      </div>
                    </Label>
                    <div className="space-y-3">
                      <input
                        id="pictures"
                        name="pictures"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input-custom w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                      />
                      
                      {/* Selected Files Display */}
                      {selectedFiles.length > 0 && (
                        <div
                          className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10"
                        >
                          <h4 className="text-white font-medium text-sm sm:text-base mb-2">Selected Files:</h4>
                          <div className="space-y-1">
                            {selectedFiles.map((fileName, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm"
                              >
                                <CheckCircle2 className="w-3 h-3 sm:w-4 h-4 text-green-400" />
                                {fileName}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="submit-btn w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-800 disabled:to-pink-800 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none text-sm sm:text-base lg:text-lg flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div
                          className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                        />
                        Creating School...
                      </>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        Create School
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 