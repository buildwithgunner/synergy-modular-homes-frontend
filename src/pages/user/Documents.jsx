export default function Documents() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Documents</h1>

      <div className="bg-white rounded-2xl border p-6 mb-6">
        <p className="text-sm text-slate-600 mb-4">
          Upload required documents for financing and verification.
        </p>

        <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center">
          <p className="text-slate-500 mb-3">Drag & drop files here or</p>
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700">
            Browse Files
          </button>
          <p className="text-xs text-slate-400 mt-3">PDF, JPG, PNG up to 10MB</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="px-5 py-3 border-b bg-slate-50 font-semibold text-sm text-slate-600">
          Uploaded Documents
        </div>
        <div className="p-5 text-sm text-slate-500">
          No documents uploaded yet.
        </div>
      </div>
    </div>
  )
}