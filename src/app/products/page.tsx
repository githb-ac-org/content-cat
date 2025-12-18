"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import UploadModal from "@/components/UploadModal";
import UploadReviewModal, {
  type UploadedImage,
} from "@/components/UploadReviewModal";

interface Product {
  id: string;
  name: string;
  referenceImages: string[];
  thumbnailUrl: string | null;
  createdAt: string;
}

const previewImages = [
  {
    id: 1,
    image: "/images/product-1.jpg",
    rotation: "-rotate-12",
    size: "h-40 w-32",
    z: "z-10",
    offset: "-mr-4",
  },
  {
    id: 2,
    image: "/images/product-2.jpg",
    rotation: "rotate-3",
    size: "h-52 w-40",
    z: "z-20",
    offset: "-mr-6",
  },
  {
    id: 3,
    image: "/images/product-3.jpg",
    rotation: "-rotate-6",
    size: "h-44 w-34",
    z: "z-30",
    offset: "-mr-3",
  },
  {
    id: 4,
    image: "/images/product-4.jpg",
    rotation: "rotate-10",
    size: "h-48 w-36",
    z: "z-20",
    offset: "",
  },
];

const galleryImages = [
  { id: 1, image: "/images/product-gallery-1.jpg" },
  { id: 2, image: "/images/product-gallery-2.jpg" },
  { id: 3, image: "/images/product-gallery-3.jpg" },
  { id: 4, image: "/images/product-gallery-4.jpg" },
  { id: 5, image: "/images/product-gallery-5.jpg" },
];

export default function Products() {
  const router = useRouter();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  // Fetch existing products
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles(files);
    setIsUploadModalOpen(false);
    setIsReviewModalOpen(true);
  };

  const handleGenerate = async (name: string, images: UploadedImage[]) => {
    setIsCreating(true);
    try {
      // Upload images to fal.ai storage
      const formData = new FormData();
      images.forEach((img) => {
        if (img.file) formData.append("files", img.file);
      });

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload images");
      }

      const { urls } = await uploadResponse.json();

      // Create product in database
      const createResponse = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          referenceImages: urls,
        }),
      });

      if (!createResponse.ok) {
        throw new Error("Failed to create product");
      }

      // Refresh products list
      await fetchProducts();

      setIsReviewModalOpen(false);
      setUploadedFiles([]);
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Failed to create product. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setDeleteProductId(id);
  };

  const confirmDelete = async () => {
    if (!deleteProductId) return;

    try {
      const response = await fetch(`/api/products/${deleteProductId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteProductId));
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setDeleteProductId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteProductId(null);
  };

  const handleReviewModalClose = () => {
    setIsReviewModalOpen(false);
    setUploadedFiles([]);
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsReviewModalOpen(true);
  };

  const handleSaveEdit = async (
    id: string,
    name: string,
    images: UploadedImage[]
  ) => {
    setIsCreating(true);
    try {
      // Separate existing images from new uploads
      const existingUrls = images
        .filter((img) => img.isExisting)
        .map((img) => img.preview);
      const newFiles = images.filter((img) => !img.isExisting && img.file);

      let newUrls: string[] = [];

      // Upload new images if any
      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach((img) => {
          if (img.file) formData.append("files", img.file);
        });

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload images");
        }

        const { urls } = await uploadResponse.json();
        newUrls = urls;
      }

      // Combine existing and new URLs
      const allUrls = [...existingUrls, ...newUrls];

      // Update product in database
      const updateResponse = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          referenceImages: allUrls,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update product");
      }

      // Refresh products list
      await fetchProducts();

      setIsReviewModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleGenerateWithProduct = (productId: string) => {
    router.push(`/image?model=products&productId=${productId}`);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0a0a]">
      <Header />
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFilesSelected={handleFilesSelected}
      />
      <UploadReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleReviewModalClose}
        initialFiles={uploadedFiles}
        onGenerate={handleGenerate}
        editCharacter={editingProduct}
        onSaveEdit={handleSaveEdit}
        isLoading={isCreating}
      />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        {/* Preview Cards */}
        <div className="flex items-end justify-center">
          {previewImages.map((item) => (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-2xl border-2 border-white bg-zinc-800 ${item.size} ${item.rotation} ${item.z} ${item.offset}`}
            >
              <Image
                src={item.image}
                alt={`Product preview ${item.id}`}
                fill
                sizes="200px"
                priority
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Title Section */}
        <div className="text-center">
          <h1 className="font-heading text-4xl text-white">
            MAKE AI PRODUCT SHOTS
          </h1>
          <p className="mt-3 text-sm text-gray-400">
            Upload photos of your product. Get new shots with different
            backgrounds, lighting, angles.
          </p>
          <p className="text-sm text-gray-400">
            Works for images and videos. Good for ads, social posts, whatever
            you need
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => setIsUploadModalOpen(true)}
          disabled={isCreating}
          className="mb-4 flex cursor-pointer items-center gap-2 rounded-lg bg-cyan-400 px-6 py-3 font-semibold text-black shadow-lg shadow-cyan-400/25 transition-all duration-300 hover:bg-cyan-500 hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>✦</span>
          {isCreating ? "Creating..." : "Create Product Shot"}
        </button>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="w-full max-w-4xl">
            <div className="flex flex-wrap justify-center gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="skeleton-loader h-72 w-48 rounded-none"
                />
              ))}
            </div>
          </div>
        )}

        {/* Saved Products Section */}
        {!isLoading && products.length > 0 && (
          <div className="w-full max-w-4xl">
            <div className="flex flex-wrap justify-center gap-4">
              {products.map((product) => (
                <div key={product.id} className="group relative">
                  <div className="relative h-72 w-48 overflow-hidden bg-zinc-800">
                    {product.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.thumbnailUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-all duration-300 ease-out group-hover:brightness-50"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-500">
                        No image
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
                    {/* Generate button - appears on hover */}
                    <button
                      type="button"
                      onClick={() => handleGenerateWithProduct(product.id)}
                      className="absolute top-1/2 left-1/2 inline-grid h-12 -translate-x-1/2 -translate-y-1/2 grid-flow-col items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 text-sm font-medium text-cyan-400 opacity-0 backdrop-blur-sm transition-all duration-300 ease-out group-hover:opacity-100 hover:bg-cyan-400/20"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        className="size-5"
                      >
                        <path
                          d="M11.8525 4.21651L11.7221 3.2387C11.6906 3.00226 11.4889 2.82568 11.2504 2.82568C11.0118 2.82568 10.8102 3.00226 10.7786 3.23869L10.6483 4.21651C10.2658 7.0847 8.00939 9.34115 5.14119 9.72358L4.16338 9.85396C3.92694 9.88549 3.75037 10.0872 3.75037 10.3257C3.75037 10.5642 3.92694 10.7659 4.16338 10.7974L5.14119 10.9278C8.00938 11.3102 10.2658 13.5667 10.6483 16.4349L10.7786 17.4127C10.8102 17.6491 11.0118 17.8257 11.2504 17.8257C11.4889 17.8257 11.6906 17.6491 11.7221 17.4127L11.8525 16.4349C12.2349 13.5667 14.4913 11.3102 17.3595 10.9278L18.3374 10.7974C18.5738 10.7659 18.7504 10.5642 18.7504 10.3257C18.7504 10.0872 18.5738 9.88549 18.3374 9.85396L17.3595 9.72358C14.4913 9.34115 12.2349 7.0847 11.8525 4.21651Z"
                          fill="currentColor"
                        />
                        <path
                          d="M4.6519 14.7568L4.82063 14.2084C4.84491 14.1295 4.91781 14.0757 5.00037 14.0757C5.08292 14.0757 5.15582 14.1295 5.1801 14.2084L5.34883 14.7568C5.56525 15.4602 6.11587 16.0108 6.81925 16.2272L7.36762 16.3959C7.44652 16.4202 7.50037 16.4931 7.50037 16.5757C7.50037 16.6582 7.44652 16.7311 7.36762 16.7554L6.81926 16.9241C6.11587 17.1406 5.56525 17.6912 5.34883 18.3946L5.1801 18.9429C5.15582 19.0218 5.08292 19.0757 5.00037 19.0757C4.91781 19.0757 4.84491 19.0218 4.82063 18.9429L4.65191 18.3946C4.43548 17.6912 3.88486 17.1406 3.18147 16.9241L2.63311 16.7554C2.55421 16.7311 2.50037 16.6582 2.50037 16.5757C2.50037 16.4931 2.55421 16.4202 2.63311 16.3959L3.18148 16.2272C3.88486 16.0108 4.43548 15.4602 4.6519 14.7568Z"
                          fill="currentColor"
                        />
                      </svg>
                      Generate
                    </button>
                    {/* Top-right action buttons - appear on hover */}
                    <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100">
                      {/* Edit button */}
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="grid h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white/70 backdrop-blur-sm transition-colors hover:text-white"
                        title="Edit product"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 20 20"
                          className="size-4"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M14.8536 2.14645C14.6583 1.95118 14.3417 1.95118 14.1465 2.14645L3.14645 13.1464C3.09858 13.1943 3.06427 13.2541 3.0472 13.3199L2.0472 17.3199C1.99312 17.536 2.05666 17.7647 2.21308 17.9211C2.3695 18.0776 2.59818 18.1411 2.81425 18.087L6.81425 17.087C6.88009 17.0699 6.93981 17.0356 6.98768 16.9878L17.9877 5.98778C18.183 5.79252 18.183 5.47594 17.9877 5.28068L14.8536 2.14645ZM5.74194 14.2581L13.5 6.5L13.5 6.5L14.2071 7.20711L6.44906 14.9651L4.12178 15.5469L5.74194 14.2581Z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="grid h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white/70 backdrop-blur-sm transition-colors hover:text-red-500"
                        title="Delete product"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 20 20"
                          className="size-4"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8.75 4.25V5H11.25V4.25C11.25 3.83579 10.9142 3.5 10.5 3.5H9.5C9.08579 3.5 8.75 3.83579 8.75 4.25ZM12.75 5V4.25C12.75 3.00736 11.7426 2 10.5 2H9.5C8.25736 2 7.25 3.00736 7.25 4.25V5H4C3.58579 5 3.25 5.33579 3.25 5.75C3.25 6.16421 3.58579 6.5 4 6.5H4.75V15.75C4.75 17.1307 5.86929 18.25 7.25 18.25H12.75C14.1307 18.25 15.25 17.1307 15.25 15.75V6.5H16C16.4142 6.5 16.75 6.16421 16.75 5.75C16.75 5.33579 16.4142 5 16 5H12.75ZM6.25 6.5V15.75C6.25 16.3023 6.69772 16.75 7.25 16.75H12.75C13.3023 16.75 13.75 16.3023 13.75 15.75V6.5H6.25Z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p className="font-heading truncate text-xs text-white uppercase">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {product.referenceImages.length} images
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State / Gallery Section */}
        {!isLoading && products.length === 0 && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {galleryImages.map((item) => (
              <div
                key={item.id}
                className="relative h-72 w-48 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-800"
              >
                <Image
                  src={item.image}
                  alt={`Gallery image ${item.id}`}
                  fill
                  sizes="192px"
                  priority
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={cancelDelete}
          />
          {/* Modal */}
          <div className="relative z-10 w-full max-w-sm rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Delete Product</h3>
            <p className="mt-2 text-sm text-gray-400">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={cancelDelete}
                className="rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
