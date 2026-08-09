import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Archive,
  Boxes,
  Copy,
  Edit3,
  PackagePlus,
  RefreshCcw,
  Save,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { base44, hasConfiguredBackend } from '@/api/base44Client';
import LuxuryButton from '@/components/luxury/LuxuryButton';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/AuthContext';
import { formatPrice } from '@/lib/formatPrice';

const TABS = [
  { id: 'products', label: 'Products', icon: Boxes },
  { id: 'artisans', label: 'Artisans', icon: Users },
  { id: 'vendors', label: 'Vendors', icon: PackagePlus },
];

const EMPTY_PRODUCT = {
  title: '', sku: '', slug: '', category: '', collection: '', price: '', compare_at_price: '',
  stock: '0', material: '', origin: '', craft: '', description: '', care_instructions: '',
  lead_time: '', images: '', status: 'draft', published: false, ready_to_ship: true,
  made_to_order: false, limited_edition: false, one_of_one: false,
};

const EMPTY_ARTISAN = {
  name: '', slug: '', location: '', craft: '', years_experience: '', biography: '',
  workshop_information: '', consent_status: 'pending', verification_notes: '', published: false,
};

const EMPTY_VENDOR = {
  name: '', email: '', phone: '', whatsapp_number: '', supply_category: '',
  minimum_order_quantity: '', stock_model: '', replacement_terms: '', internal_notes: '',
};

const slugify = (value) => String(value || '')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const productId = (title) => {
  const suffix = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().slice(0, 8)
    : Date.now().toString(36);
  return `${slugify(title) || 'product'}-${suffix}`;
};

function Field({ label, value, onChange, type = 'text', required = false, placeholder = '', as = 'input' }) {
  const Component = as;
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      <Component
        type={as === 'input' ? type : undefined}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        rows={as === 'textarea' ? 4 : undefined}
        className="w-full border border-gold/20 bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold focus:outline-none"
      />
    </label>
  );
}

function CheckField({ label, checked, onChange }) {
  return (
    <label className="flex min-h-11 items-center gap-3 border border-gold/15 bg-ivory px-4 py-3 text-xs text-charcoal">
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-[#5B3A29]"
      />
      {label}
    </label>
  );
}

function AdminGate({ isAuthenticated, onLogin }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 pb-20 pt-28">
      <div className="max-w-md border border-gold/15 bg-sand/35 p-8 text-center shadow-3d">
        <ShieldCheck size={34} className="mx-auto mb-4 text-gold" />
        <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Protected workspace</p>
        <h1 className="mt-3 font-display text-3xl font-light text-charcoal">Catalogue access is restricted</h1>
        <p className="mt-4 text-sm leading-7 text-charcoal/65">Only authorised Poshkaar administrators can change products, artisans and vendors.</p>
        <div className="mt-7">
          {isAuthenticated
            ? <Link to="/account"><LuxuryButton variant="secondary">Back to Account</LuxuryButton></Link>
            : <LuxuryButton variant="primary" onClick={onLogin}>Sign In</LuxuryButton>}
        </div>
      </div>
    </main>
  );
}

export default function AdminCatalog() {
  const { user, isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState('products');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const isAdmin = user?.role === 'admin';

  const entityName = tab === 'products' ? 'Product' : tab === 'artisans' ? 'Artisan' : 'Vendor';

  const resetForm = (nextTab = tab) => {
    setEditingId('');
    setForm(nextTab === 'products' ? EMPTY_PRODUCT : nextTab === 'artisans' ? EMPTY_ARTISAN : EMPTY_VENDOR);
  };

  const loadRecords = async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError('');
    try {
      const items = await base44.entities[entityName].list('-created_date', 250);
      setRecords(items || []);
    } catch (loadError) {
      console.error(`Unable to load ${entityName}:`, loadError);
      setError(loadError?.message || `Unable to load ${tab}. Run the production commerce migration and check admin access.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    resetForm(tab);
    if (isAdmin) loadRecords();
    else setLoading(false);
    // entityName changes with tab and is intentionally covered by tab.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, isAdmin]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const productPayload = () => ({
    title: form.title.trim(),
    sku: form.sku.trim() || null,
    slug: form.slug.trim() || slugify(form.title),
    category: form.category.trim() || null,
    collection: form.collection.trim() || null,
    price: Math.max(0, Number(form.price) || 0),
    compare_at_price: form.compare_at_price === '' ? null : Math.max(0, Number(form.compare_at_price) || 0),
    stock: Math.max(0, Math.floor(Number(form.stock) || 0)),
    material: form.material.trim() || null,
    origin: form.origin.trim() || null,
    craft: form.craft.trim() || null,
    description: form.description.trim() || null,
    care_instructions: form.care_instructions.trim() || null,
    lead_time: form.lead_time.trim() || null,
    images: form.images.split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
    status: form.status,
    published: Boolean(form.published),
    ready_to_ship: Boolean(form.ready_to_ship),
    made_to_order: Boolean(form.made_to_order),
    limited_edition: Boolean(form.limited_edition),
    one_of_one: Boolean(form.one_of_one),
  });

  const artisanPayload = () => ({
    name: form.name.trim(),
    slug: form.slug.trim() || slugify(form.name),
    location: form.location.trim() || null,
    craft: form.craft.trim() || null,
    years_experience: form.years_experience === '' ? null : Math.max(0, Math.floor(Number(form.years_experience) || 0)),
    biography: form.biography.trim() || null,
    workshop_information: form.workshop_information.trim() || null,
    consent_status: form.consent_status,
    verification_notes: form.verification_notes.trim() || null,
    published: Boolean(form.published && form.consent_status === 'granted'),
  });

  const vendorPayload = () => ({
    name: form.name.trim(),
    email: form.email.trim().toLowerCase() || null,
    phone: form.phone.trim() || null,
    whatsapp_number: form.whatsapp_number.trim() || null,
    supply_category: form.supply_category.trim() || null,
    minimum_order_quantity: form.minimum_order_quantity === '' ? null : Math.max(0, Math.floor(Number(form.minimum_order_quantity) || 0)),
    stock_model: form.stock_model.trim() || null,
    replacement_terms: form.replacement_terms.trim() || null,
    internal_notes: form.internal_notes.trim() || null,
  });

  const handleSave = async (event) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const payload = tab === 'products' ? productPayload() : tab === 'artisans' ? artisanPayload() : vendorPayload();
      if (editingId) {
        await base44.entities[entityName].update(editingId, payload);
      } else {
        await base44.entities[entityName].create(tab === 'products'
          ? { id: productId(payload.title), ...payload }
          : payload);
      }
      toast({ title: editingId ? 'Changes saved' : `${entityName} created` });
      resetForm();
      await loadRecords();
    } catch (saveError) {
      toast({ title: 'Could not save', description: saveError?.message || 'Check the record and try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const editRecord = (record) => {
    setEditingId(record.id);
    if (tab === 'products') {
      setForm({
        ...EMPTY_PRODUCT,
        ...record,
        stock: String(record.stock ?? record.stock_quantity ?? 0),
        price: String(record.price ?? ''),
        compare_at_price: record.compare_at_price == null ? '' : String(record.compare_at_price),
        images: Array.isArray(record.images) ? record.images.join('\n') : '',
      });
    } else if (tab === 'artisans') {
      setForm({ ...EMPTY_ARTISAN, ...record, years_experience: record.years_experience ?? '' });
    } else {
      setForm({ ...EMPTY_VENDOR, ...record, minimum_order_quantity: record.minimum_order_quantity ?? '' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteRecord = async (record) => {
    if (!window.confirm(`Delete “${record.title || record.name}”? This cannot be undone.`)) return;
    try {
      await base44.entities[entityName].delete(record.id);
      toast({ title: `${entityName} deleted` });
      await loadRecords();
    } catch (deleteError) {
      toast({ title: 'Could not delete', description: deleteError?.message, variant: 'destructive' });
    }
  };

  const updateProductStatus = async (record, updates) => {
    try {
      await base44.entities.Product.update(record.id, updates);
      toast({ title: updates.published ? 'Product published' : updates.status === 'archived' ? 'Product archived' : 'Product unpublished' });
      await loadRecords();
    } catch (statusError) {
      toast({ title: 'Could not update product', description: statusError?.message, variant: 'destructive' });
    }
  };

  const duplicateProduct = async (record) => {
    try {
      const copy = {
        ...record,
        id: productId(record.title),
        title: `${record.title} — Copy`,
        slug: `${slugify(record.slug || record.title)}-copy-${Date.now().toString(36)}`,
        sku: null,
        published: false,
        status: 'draft',
      };
      ['created_date', 'created_at', 'updated_date', 'updated_at', 'stock_quantity'].forEach((key) => delete copy[key]);
      await base44.entities.Product.create(copy);
      toast({ title: 'Draft copy created' });
      await loadRecords();
    } catch (copyError) {
      toast({ title: 'Could not duplicate product', description: copyError?.message, variant: 'destructive' });
    }
  };

  const counts = useMemo(() => ({
    total: records.length,
    published: tab === 'products' ? records.filter((item) => item.published).length : 0,
    drafts: tab === 'products' ? records.filter((item) => !item.published).length : 0,
  }), [records, tab]);

  if (isLoadingAuth) return <div className="min-h-screen bg-ivory pt-32 text-center text-sm text-charcoal/60">Checking admin access…</div>;
  if (!isAdmin) return <AdminGate isAuthenticated={isAuthenticated} onLogin={navigateToLogin} />;

  return (
    <main className="min-h-screen pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <header className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Admin Dashboard</p>
            <h1 className="mt-3 font-display text-4xl font-light text-charcoal md:text-5xl">Catalogue Workspace</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-charcoal/65">Prepare verified product, artisan and vendor records. New products stay as drafts until you publish them.</p>
          </div>
          <nav className="flex flex-wrap gap-3" aria-label="Admin sections">
            <Link to="/admin/orders" className="border border-gold/25 px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-charcoal hover:border-gold">Manage Orders</Link>
            <button type="button" onClick={loadRecords} className="inline-flex items-center gap-2 border border-charcoal bg-charcoal px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-ivory"><RefreshCcw size={13} /> Refresh</button>
          </nav>
        </header>

        {!hasConfiguredBackend && (
          <div className="mb-8 border border-burgundy/25 bg-burgundy/5 px-5 py-4 text-sm text-burgundy">Connect Supabase before using the admin workspace.</div>
        )}

        <div className="mb-8 flex gap-2 overflow-x-auto border-b border-gold/15 pb-3" role="tablist" aria-label="Catalogue records">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 px-5 text-[10px] uppercase tracking-[0.16em] ${tab === id ? 'bg-charcoal text-ivory' : 'border border-gold/15 text-charcoal'}`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
          <form onSubmit={handleSave} className="h-fit border border-gold/15 bg-sand/35 p-5 md:p-7 xl:sticky xl:top-28">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-gold">{editingId ? 'Edit record' : 'New record'}</p>
                <h2 className="mt-2 font-display text-2xl text-charcoal">{editingId ? 'Update details' : `Add ${entityName.toLowerCase()}`}</h2>
              </div>
              {editingId && <button type="button" onClick={() => resetForm()} aria-label="Cancel editing" className="flex h-10 w-10 items-center justify-center border border-gold/20"><X size={15} /></button>}
            </div>

            {tab === 'products' && <ProductForm form={form} update={update} />}
            {tab === 'artisans' && <ArtisanForm form={form} update={update} />}
            {tab === 'vendors' && <VendorForm form={form} update={update} />}

            <LuxuryButton type="submit" variant="primary" className="mt-6 min-h-12 w-full" disabled={saving || !hasConfiguredBackend}>
              <Save size={14} /> {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Draft'}
            </LuxuryButton>
          </form>

          <section aria-live="polite">
            <div className="mb-5 flex items-end justify-between border-b border-gold/15 pb-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-gold">Records</p>
                <h2 className="mt-1 font-display text-3xl text-charcoal">{counts.total} {tab}</h2>
              </div>
              {tab === 'products' && <p className="text-xs text-charcoal/55">{counts.published} published · {counts.drafts} drafts</p>}
            </div>

            {error && <div className="mb-5 border border-burgundy/25 bg-burgundy/5 px-5 py-4 text-sm text-burgundy">{error}</div>}
            {loading ? (
              <div className="grid gap-3">{[1, 2, 3, 4].map((item) => <div key={item} className="h-28 bg-sand/50 shimmer" />)}</div>
            ) : records.length === 0 ? (
              <div className="border border-gold/15 bg-sand/25 px-6 py-16 text-center text-sm text-charcoal/60">No {tab} yet. Use the form to create the first record.</div>
            ) : (
              <div className="grid gap-3">
                {records.map((record) => (
                  <RecordCard
                    key={record.id}
                    tab={tab}
                    record={record}
                    onEdit={() => editRecord(record)}
                    onDelete={() => deleteRecord(record)}
                    onDuplicate={() => duplicateProduct(record)}
                    onArchive={() => updateProductStatus(record, { published: false, status: 'archived' })}
                    onPublish={() => updateProductStatus(record, record.published
                      ? { published: false, status: 'draft' }
                      : { published: true, status: 'active' })}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function ProductForm({ form, update }) {
  return (
    <div className="grid gap-4">
      <Field label="Title" value={form.title} onChange={(value) => update('title', value)} required />
      <div className="grid grid-cols-2 gap-3">
        <Field label="SKU" value={form.sku} onChange={(value) => update('sku', value)} />
        <Field label="Slug" value={form.slug} onChange={(value) => update('slug', value)} placeholder="Created from title" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Category" value={form.category} onChange={(value) => update('category', value)} />
        <Field label="Collection" value={form.collection} onChange={(value) => update('collection', value)} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Price ₹" type="number" value={form.price} onChange={(value) => update('price', value)} required />
        <Field label="Sale price ₹" type="number" value={form.compare_at_price} onChange={(value) => update('compare_at_price', value)} />
        <Field label="Stock" type="number" value={form.stock} onChange={(value) => update('stock', value)} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Material" value={form.material} onChange={(value) => update('material', value)} />
        <Field label="Origin" value={form.origin} onChange={(value) => update('origin', value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Craft / technique" value={form.craft} onChange={(value) => update('craft', value)} />
        <Field label="Lead time" value={form.lead_time} onChange={(value) => update('lead_time', value)} />
      </div>
      <Field label="Description" as="textarea" value={form.description} onChange={(value) => update('description', value)} />
      <Field label="Care instructions" as="textarea" value={form.care_instructions} onChange={(value) => update('care_instructions', value)} />
      <Field label="Image URLs — one per line" as="textarea" value={form.images} onChange={(value) => update('images', value)} />
      <div className="grid grid-cols-2 gap-3">
        <CheckField label="Published" checked={form.published} onChange={(value) => update('published', value)} />
        <CheckField label="Ready to ship" checked={form.ready_to_ship} onChange={(value) => update('ready_to_ship', value)} />
        <CheckField label="Made to order" checked={form.made_to_order} onChange={(value) => update('made_to_order', value)} />
        <CheckField label="Limited edition" checked={form.limited_edition} onChange={(value) => update('limited_edition', value)} />
        <CheckField label="One of one" checked={form.one_of_one} onChange={(value) => update('one_of_one', value)} />
      </div>
    </div>
  );
}

function ArtisanForm({ form, update }) {
  return (
    <div className="grid gap-4">
      <Field label="Name" value={form.name} onChange={(value) => update('name', value)} required />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Location" value={form.location} onChange={(value) => update('location', value)} />
        <Field label="Craft" value={form.craft} onChange={(value) => update('craft', value)} />
      </div>
      <Field label="Years of experience" type="number" value={form.years_experience} onChange={(value) => update('years_experience', value)} />
      <Field label="Biography" as="textarea" value={form.biography} onChange={(value) => update('biography', value)} />
      <Field label="Workshop information" as="textarea" value={form.workshop_information} onChange={(value) => update('workshop_information', value)} />
      <label>
        <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Consent status</span>
        <select value={form.consent_status} onChange={(event) => update('consent_status', event.target.value)} className="w-full border border-gold/20 bg-ivory px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none">
          <option value="pending">Pending</option><option value="granted">Granted</option><option value="withdrawn">Withdrawn</option>
        </select>
      </label>
      <Field label="Verification notes — private" as="textarea" value={form.verification_notes} onChange={(value) => update('verification_notes', value)} />
      <CheckField label="Publish public profile" checked={form.published} onChange={(value) => update('published', value)} />
    </div>
  );
}

function VendorForm({ form, update }) {
  return (
    <div className="grid gap-4">
      <Field label="Vendor name" value={form.name} onChange={(value) => update('name', value)} required />
      <div className="grid grid-cols-2 gap-3"><Field label="Email" type="email" value={form.email} onChange={(value) => update('email', value)} /><Field label="Phone" value={form.phone} onChange={(value) => update('phone', value)} /></div>
      <Field label="WhatsApp number" value={form.whatsapp_number} onChange={(value) => update('whatsapp_number', value)} />
      <div className="grid grid-cols-2 gap-3"><Field label="Supply category" value={form.supply_category} onChange={(value) => update('supply_category', value)} /><Field label="Minimum order" type="number" value={form.minimum_order_quantity} onChange={(value) => update('minimum_order_quantity', value)} /></div>
      <Field label="Stock model" value={form.stock_model} onChange={(value) => update('stock_model', value)} placeholder="Owned, consignment, made to order…" />
      <Field label="Replacement terms" as="textarea" value={form.replacement_terms} onChange={(value) => update('replacement_terms', value)} />
      <Field label="Internal notes" as="textarea" value={form.internal_notes} onChange={(value) => update('internal_notes', value)} />
    </div>
  );
}

function RecordCard({ tab, record, onEdit, onDelete, onDuplicate, onArchive, onPublish }) {
  const isProduct = tab === 'products';
  return (
    <article className="border border-gold/15 bg-ivory p-4 shadow-[0_20px_70px_-60px_rgba(91,58,41,0.8)] md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          {isProduct && (
            <div className="h-20 w-16 shrink-0 overflow-hidden bg-sand">
              <img src={record.images?.[0] || '/images/product-placeholder.svg'} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-xl text-charcoal">{record.title || record.name}</h3>
              {isProduct && <span className={`border px-2 py-1 text-[8px] uppercase tracking-[0.14em] ${record.published ? 'border-forest/25 bg-forest/5 text-forest' : 'border-gold/25 text-walnut'}`}>{record.published ? 'Published' : record.status || 'Draft'}</span>}
            </div>
            <p className="mt-1 text-xs text-charcoal/55">
              {isProduct
                ? `${record.sku || 'No SKU'} · ${record.category || 'No category'} · ${formatPrice(record.price || 0)} · ${record.stock ?? record.stock_quantity ?? 0} in stock`
                : tab === 'artisans'
                  ? `${record.craft || 'Craft pending'} · ${record.location || 'Location pending'} · Consent: ${record.consent_status}`
                  : `${record.supply_category || 'Supply category pending'} · ${record.email || record.phone || 'Contact pending'}`}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {isProduct && <button type="button" onClick={onPublish} className="min-h-10 border border-gold/20 px-3 text-[9px] uppercase tracking-[0.14em] text-charcoal hover:border-gold">{record.published ? 'Unpublish' : 'Publish'}</button>}
          {isProduct && <button type="button" onClick={onDuplicate} className="flex min-h-10 items-center gap-1.5 border border-gold/20 px-3 text-[9px] uppercase tracking-[0.14em] text-charcoal hover:border-gold"><Copy size={12} /> Duplicate</button>}
          {isProduct && <button type="button" onClick={onArchive} className="flex min-h-10 items-center gap-1.5 border border-gold/20 px-3 text-[9px] uppercase tracking-[0.14em] text-charcoal hover:border-gold"><Archive size={12} /> Archive</button>}
          <button type="button" onClick={onEdit} className="flex min-h-10 items-center gap-1.5 bg-charcoal px-3 text-[9px] uppercase tracking-[0.14em] text-ivory"><Edit3 size={12} /> Edit</button>
          <button type="button" onClick={onDelete} aria-label={`Delete ${record.title || record.name}`} className="flex h-10 w-10 items-center justify-center border border-burgundy/20 text-burgundy hover:bg-burgundy hover:text-ivory"><Trash2 size={13} /></button>
        </div>
      </div>
    </article>
  );
}
