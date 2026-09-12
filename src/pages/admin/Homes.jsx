import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

const emptyForm = {
  title: '',
  house_name: '',
  price_min: '',
  price_max: '',
  currency: 'USD',
  beds: '',
  baths: '',
  living_area_min: '',
  living_area_max: '',
  total_covered_area_min: '',
  total_covered_area_max: '',
  location: '',
  house_type: 'Single Wide',
  description: '',
  image: '',
  imageFile: null,
  galleryFiles: [],
  status: 'available',
  is_featured: false,
  specs: {
    solar: 'None',
    water: 'Municipal',
    insulation: 'Standard',
    toilet: 'Standard',
    lofts: '0',
    heating: 'Central',
  },
  amenities: [],
  images: [],
}

const houseTypeOptions = [
  'ADU (Accessory Dwelling Unit)',
  'Cabin',
  'Single Wide',
  'Double Wide',
  'Tiny Home',
  'Workforce Housing',
]

const currencyOptions = [
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
]

const statusOptions = ['available', 'pending', 'sold']

const commonAmenities = [
  'Central A/C',
  'Updated Kitchen',
  'Washer/Dryer Hookups',
  'Covered Porch',
  'Storage Shed',
  'Walk-in Closet',
  'Modern Appliances',
  'Ceiling Fans',
  'Open Living Area',
  'Luxury Finishes',
  'Large Living Space',
  '2+ Bathrooms',
  'Family Layout',
  'Good Storage',
  'Low Maintenance',
  'Financing Available',
  'Delivery & Setup Available',
]

export default function AdminHomes() {
  const [homes, setHomes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [newAmenity, setNewAmenity] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [galleryPreviews, setGalleryPreviews] = useState([])

  const fetchHomes = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/homes`)
      if (!res.ok) throw new Error('Failed to fetch homes')
      const data = await res.json()
      setHomes(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHomes()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm({ ...emptyForm, amenities: [], images: [], galleryFiles: [], imageFile: null })
    setImagePreview(null)
    setGalleryPreviews([])
    setNewAmenity('')
    setShowModal(true)
  }

  const openEdit = (home) => {
    setEditingId(home.id)
    setForm({
      title: home.title || '',
      house_name: home.house_name || '',
      price_min: home.price_min ?? home.price ?? '',
      price_max: home.price_max ?? '',
      currency: home.currency || 'USD',
      beds: home.beds ?? '',
      baths: home.baths ?? '',
      living_area_min: home.living_area_min ?? home.living_area ?? '',
      living_area_max: home.living_area_max ?? '',
      total_covered_area_min: home.total_covered_area_min ?? home.total_covered_area ?? '',
      total_covered_area_max: home.total_covered_area_max ?? '',
      location: home.location || '',
      house_type: home.house_type || home.type || 'Single Wide',
      description: home.description || '',
      image: home.image || '',
      imageFile: null,
      galleryFiles: [],
      status: home.status || 'available',
      is_featured: Boolean(home.is_featured),
      specs: { ...emptyForm.specs, ...(home.specs || {}) },
      amenities: Array.isArray(home.amenities) ? home.amenities : [],
      images: Array.isArray(home.images) ? home.images : [],
    })
    setImagePreview(home.image || null)
    setGalleryPreviews(Array.isArray(home.images) ? home.images : [])
    setNewAmenity('')
    setShowModal(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleNumberChange = (field, value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setForm((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSpecChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      specs: { ...prev.specs, [key]: value },
    }))
  }

  const toggleAmenity = (amenity) => {
    setForm((prev) => {
      const exists = prev.amenities.includes(amenity)
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      }
    })
  }

  const addCustomAmenity = () => {
    const amenity = newAmenity.trim()
    if (!amenity) return
    if (!form.amenities.includes(amenity)) {
      setForm((prev) => ({ ...prev, amenities: [...prev.amenities, amenity] }))
    }
    setNewAmenity('')
  }

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setForm((prev) => ({ ...prev, galleryFiles: [...prev.galleryFiles, ...files] }))
    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setGalleryPreviews((prev) => [...prev, ...newPreviews])
    e.target.value = ''
  }

  const removeGalleryPreview = (index) => {
    const preview = galleryPreviews[index]
    if (preview && typeof preview === 'string' && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index))
    setForm((prev) => {
      const existingCount = prev.images.length
      if (index < existingCount) {
        return { ...prev, images: prev.images.filter((_, i) => i !== index) }
      }
      const fileIndex = index - existingCount
      return { ...prev, galleryFiles: prev.galleryFiles.filter((_, i) => i !== fileIndex) }
    })
  }

  const formatPriceDisplay = (home) => {
    const symbol = home.currency === 'GBP' ? '£' : '$'
    if (home.price_min && home.price_max) {
      return `${symbol}${Number(home.price_min).toLocaleString()} – ${symbol}${Number(home.price_max).toLocaleString()}`
    }
    if (home.price_min) return `From ${symbol}${Number(home.price_min).toLocaleString()}`
    if (home.price) return `${symbol}${Number(home.price).toLocaleString()}`
    return '—'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.price_min) {
      alert('Please enter at least a minimum price.')
      return
    }
    setSaving(true)

    try {
      const formData = new FormData()

      formData.append('title', form.title.trim())
      formData.append('house_name', form.house_name.trim())
      formData.append('price_min', form.price_min)
      if (form.price_max) formData.append('price_max', form.price_max)
      // Keep old price field in sync (use min as default)
      formData.append('price', form.price_min)
      formData.append('currency', form.currency)

      formData.append('beds', form.beds || '0')
      formData.append('baths', form.baths || '0')

      if (form.living_area_min) formData.append('living_area_min', form.living_area_min)
      if (form.living_area_max) formData.append('living_area_max', form.living_area_max)
      if (form.total_covered_area_min) formData.append('total_covered_area_min', form.total_covered_area_min)
      if (form.total_covered_area_max) formData.append('total_covered_area_max', form.total_covered_area_max)

      formData.append('location', form.location.trim())
      formData.append('house_type', form.house_type)
      formData.append('type', form.house_type)
      formData.append('description', form.description)
      formData.append('status', form.status)
      formData.append('is_featured', form.is_featured ? '1' : '0')

      formData.append('specs', JSON.stringify(form.specs))
      formData.append('amenities', JSON.stringify(form.amenities))

      if (form.imageFile) {
        formData.append('image_file', form.imageFile)
      } else if (form.image) {
        formData.append('image', form.image)
      }

      form.galleryFiles.forEach((file) => {
        formData.append('gallery[]', file)
      })

      if (form.images.length > 0) {
        formData.append('images', JSON.stringify(form.images))
      }

      const url = editingId ? `${API_BASE}/homes/${editingId}` : `${API_BASE}/homes`
      if (editingId) formData.append('_method', 'PUT')

      const res = await fetch(url, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        let msg = data?.message || 'Failed to save home'
        if (data?.errors) {
          msg = Object.values(data.errors).flat().join('\n')
        }
        throw new Error(msg)
      }

      setShowModal(false)
      await fetchHomes()
    } catch (err) {
      console.error(err)
      alert(err.message || 'Error saving home')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this home?')) return
    try {
      const res = await fetch(`${API_BASE}/homes/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error('Failed to delete')
      await fetchHomes()
    } catch (err) {
      alert('Failed to delete home')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Homes</h1>
        <button
          type="button"
          onClick={openCreate}
          className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700"
        >
          + Add Home
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border p-8 text-center text-slate-500">Loading...</div>
      ) : homes.length === 0 ? (
        <div className="bg-white rounded-2xl border p-8 text-center text-slate-500">
          No homes yet. Click “+ Add Home” to create the first one.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Title</th>
                  <th className="text-left px-4 py-3 font-semibold">Type</th>
                  <th className="text-left px-4 py-3 font-semibold">Price Range</th>
                  <th className="text-left px-4 py-3 font-semibold">Beds/Baths</th>
                  <th className="text-left px-4 py-3 font-semibold">Living Area</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="text-right px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {homes.map((home) => (
                  <tr key={home.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">{home.title || '—'}</td>
                    <td className="px-4 py-3">{home.house_type || home.type || '—'}</td>
                    <td className="px-4 py-3 font-medium">{formatPriceDisplay(home)}</td>
                    <td className="px-4 py-3">{home.beds || 0} / {home.baths || 0}</td>
                    <td className="px-4 py-3">
                      {home.living_area_min && home.living_area_max
                        ? `${home.living_area_min} – ${home.living_area_max} sqft`
                        : home.living_area_min
                        ? `${home.living_area_min}+ sqft`
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          home.status === 'available'
                            ? 'bg-emerald-100 text-emerald-700'
                            : home.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {home.status || 'available'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openEdit(home)}
                        className="text-blue-600 hover:underline text-sm mr-3"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(home.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========== MODAL ========== */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Home' : 'Add New Home'}</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Basic Info */}
              <div>
                <h3 className="font-bold mb-3">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <input name="title" required value={form.title} onChange={handleChange} className="w-full border rounded-xl px-3 py-2.5 text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">House Name</label>
                    <input name="house_name" value={form.house_name} onChange={handleChange} className="w-full border rounded-xl px-3 py-2.5 text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">House Type *</label>
                    <select
                      name="house_type"
                      value={form.house_type}
                      onChange={handleChange}
                      className="w-full border rounded-xl px-3 py-2.5 text-sm"
                    >
                      {houseTypeOptions.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Price Range *</label>
                    <div className="flex gap-3 items-center">
                      <select name="currency" value={form.currency} onChange={handleChange} className="border rounded-xl px-3 py-2.5 text-sm bg-slate-50">
                        {currencyOptions.map((c) => (
                          <option key={c.value} value={c.value}>{c.symbol}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="Min price"
                        value={form.price_min}
                        onChange={(e) => handleNumberChange('price_min', e.target.value)}
                        className="w-full border rounded-xl px-3 py-2.5 text-sm"
                        required
                      />
                      <span className="text-slate-400">–</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="Max price (optional)"
                        value={form.price_max}
                        onChange={(e) => handleNumberChange('price_max', e.target.value)}
                        className="w-full border rounded-xl px-3 py-2.5 text-sm"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Leave Max empty if it’s a fixed price</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Beds</label>
                    <input type="text" inputMode="numeric" value={form.beds} onChange={(e) => handleNumberChange('beds', e.target.value)} className="w-full border rounded-xl px-3 py-2.5 text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Baths</label>
                    <input type="text" inputMode="decimal" value={form.baths} onChange={(e) => handleNumberChange('baths', e.target.value)} className="w-full border rounded-xl px-3 py-2.5 text-sm" />
                  </div>

                  {/* Living Area Range */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Living Area (sqft)</label>
                    <div className="flex gap-2 items-center">
                      <input type="text" inputMode="numeric" placeholder="Min" value={form.living_area_min} onChange={(e) => handleNumberChange('living_area_min', e.target.value)} className="w-full border rounded-xl px-3 py-2.5 text-sm" />
                      <span className="text-slate-400">–</span>
                      <input type="text" inputMode="numeric" placeholder="Max" value={form.living_area_max} onChange={(e) => handleNumberChange('living_area_max', e.target.value)} className="w-full border rounded-xl px-3 py-2.5 text-sm" />
                    </div>
                  </div>

                  {/* Covered Area Range */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Total Covered Area (sqft)</label>
                    <div className="flex gap-2 items-center">
                      <input type="text" inputMode="numeric" placeholder="Min" value={form.total_covered_area_min} onChange={(e) => handleNumberChange('total_covered_area_min', e.target.value)} className="w-full border rounded-xl px-3 py-2.5 text-sm" />
                      <span className="text-slate-400">–</span>
                      <input type="text" inputMode="numeric" placeholder="Max" value={form.total_covered_area_max} onChange={(e) => handleNumberChange('total_covered_area_max', e.target.value)} className="w-full border rounded-xl px-3 py-2.5 text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input name="location" value={form.location} onChange={handleChange} className="w-full border rounded-xl px-3 py-2.5 text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded-xl px-3 py-2.5 text-sm">
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Main Image */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Main Image</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className="flex-1 flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-red-400">
                        <p className="text-sm text-slate-500">Upload main image</p>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setForm((prev) => ({ ...prev, imageFile: file, image: '' }))
                            setImagePreview(URL.createObjectURL(file))
                          }
                        }} />
                      </label>
                      <input
                        name="image"
                        value={form.image}
                        onChange={(e) => {
                          setForm((prev) => ({ ...prev, image: e.target.value, imageFile: null }))
                          setImagePreview(e.target.value || null)
                        }}
                        placeholder="Or paste image URL..."
                        className="flex-1 border rounded-xl px-3 py-2.5 text-sm"
                      />
                    </div>
                    {(imagePreview || form.image) && (
                      <img src={imagePreview || form.image} alt="Preview" className="mt-3 h-36 rounded-xl object-cover border" />
                    )}
                  </div>

                  {/* Gallery */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Gallery Images (multiple)</label>
                    <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-red-400">
                      <p className="text-sm text-slate-500">Click to upload multiple images</p>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryChange} />
                    </label>
                    {galleryPreviews.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {galleryPreviews.map((src, index) => (
                          <div key={index} className="relative group">
                            <img src={src} alt="" className="h-24 w-full object-cover rounded-lg border" />
                            <button type="button" onClick={() => removeGalleryPreview(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea name="description" rows="3" value={form.description} onChange={handleChange} className="w-full border rounded-xl px-3 py-2.5 text-sm" />
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} id="featured" />
                    <label htmlFor="featured" className="text-sm font-medium">Featured Home</label>
                  </div>
                </div>
              </div>

              {/* Specs */}
              <div>
                <h3 className="font-bold mb-3">Tech Specs</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(form.specs).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-slate-500 mb-1 uppercase">{key}</label>
                      <input value={value} onChange={(e) => handleSpecChange(key, e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-bold mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {commonAmenities.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAmenity(a)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition ${
                        form.amenities.includes(a) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)} placeholder="Add custom amenity..." className="flex-1 border rounded-xl px-3 py-2 text-sm" />
                  <button type="button" onClick={addCustomAmenity} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm">Add</button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border text-sm font-medium">Cancel</button>
                <button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50">
                  {saving ? 'Saving...' : editingId ? 'Update Home' : 'Create Home'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}