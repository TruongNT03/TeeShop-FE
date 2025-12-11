import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/apiClient";
import ProductCard from "../components/ProductCard";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "../components/ui/slider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPriceVND } from "@/utils/formatPriceVND";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import type { CategoryResponseDto } from "@/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ProductList = () => {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [showFilters, setShowFilters] = useState(true);
  const [showCategorySection, setShowCategorySection] = useState(true);
  const [showPriceSection, setShowPriceSection] = useState(true);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Fetch products
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: [
      "userProductList",
      selectedCategories,
      priceRange,
      sortBy,
      searchKeyword,
      currentPage,
    ],
    queryFn: () =>
      apiClient.api.productControllerFindAll(
        {
          page: currentPage,
          pageSize: pageSize,
          search: searchKeyword || undefined,
          categoryIds:
            selectedCategories.length > 0 ? selectedCategories : undefined,
          lowPrice: priceRange[0],
          highPrice: priceRange[1],
          sortBy:
            sortBy === "price-asc" || sortBy === "price-desc"
              ? "price"
              : sortBy === "name-asc" || sortBy === "name-desc"
              ? "name"
              : sortBy === "newest"
              ? "createdAt"
              : undefined,
          sortOrder:
            sortBy === "price-asc" || sortBy === "name-asc"
              ? "ASC"
              : sortBy === "price-desc" || sortBy === "name-desc"
              ? "DESC"
              : sortBy === "newest"
              ? "DESC"
              : undefined,
        },
        {
          paramsSerializer: {
            indexes: null,
          },
        }
      ),
  });

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      apiClient.api.categoriesControllerFindAll({
        pageSize: 100,
      }),
  });

  // Extract data from API response
  const products: any[] = Array.isArray(productsData?.data?.data)
    ? productsData.data.data
    : Array.isArray(productsData?.data)
    ? productsData.data
    : [];

  const categories: CategoryResponseDto[] = Array.isArray(
    categoriesData?.data?.data
  )
    ? categoriesData.data.data
    : Array.isArray(categoriesData?.data)
    ? categoriesData.data
    : [];

  // Handle category filter
  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 5000000]);
    setSortBy("newest");
    setSearchKeyword("");
    setCurrentPage(1);
  };

  // Products are already sorted by API
  const sortedProducts: any[] = products;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-stone-100 pt-6"
    >
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Sản Phẩm
              </h1>
              <p className="text-slate-600">
                Tìm thấy {sortedProducts.length} sản phẩm
              </p>
            </div>

            {/* Sort & Filter Toggle */}
            <div className="flex items-center gap-4 text-black">
              {/* Custom Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="w-[200px] bg-white px-4 py-2 cursor-pointer font-medium border rounded-lg flex items-center justify-between hover:border-slate-400 hover:shadow-sm transition-all duration-200"
                >
                  <span className="text-sm">
                    {sortBy === "newest" && "Mới nhất"}
                    {sortBy === "price-asc" && "Giá: Thấp đến Cao"}
                    {sortBy === "price-desc" && "Giá: Cao đến Thấp"}
                    {sortBy === "name-asc" && "Tên: A-Z"}
                    {sortBy === "name-desc" && "Tên: Z-A"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showSortDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showSortDropdown && (
                  <>
                    {/* Dropdown Menu */}
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-2 w-full bg-white border rounded-lg shadow-xl z-20 overflow-hidden"
                    >
                      {[
                        { value: "newest", label: "Mới nhất" },
                        { value: "price-asc", label: "Giá: Thấp đến Cao" },
                        { value: "price-desc", label: "Giá: Cao đến Thấp" },
                        { value: "name-asc", label: "Tên: A-Z" },
                        { value: "name-desc", label: "Tên: Z-A" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full cursor-pointer font-medium text-left px-4 py-2.5 text-sm hover:bg-primary/10 hover:text-primary transition-all duration-150 ${
                            sortBy === option.value
                              ? "bg-primary/5 text-primary font-medium"
                              : ""
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Bộ lọc
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full bg-white px-4 py-3 pl-10 border rounded-lg outline-none"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`w-80 space-y-6 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <Card className="p-6 shadow-none">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Bộ Lọc
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-primary hover:text-primary/80"
                >
                  Xóa tất cả
                </Button>
              </div>

              {/* Categories Filter */}
              <div className="space-y-4">
                <div>
                  <button
                    onClick={() => setShowCategorySection(!showCategorySection)}
                    className="flex items-center justify-between w-full text-left font-medium mb-3"
                  >
                    <span>Danh Mục</span>
                    {showCategorySection ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {showCategorySection && (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {isLoadingCategories ? (
                        <>
                          <Skeleton className="h-6 w-full" />
                          <Skeleton className="h-6 w-full" />
                          <Skeleton className="h-6 w-full" />
                        </>
                      ) : (
                        categories.map((category: CategoryResponseDto) => (
                          <div
                            key={category.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() =>
                                handleCategoryToggle(category.id)
                              }
                            />
                            <Label
                              htmlFor={`category-${category.id}`}
                              className="cursor-pointer text-sm font-normal"
                            >
                              {category.title}
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowPriceSection(!showPriceSection)}
                    className="flex items-center justify-between w-full text-left font-medium mb-3"
                  >
                    <span>Khoảng Giá</span>
                    {showPriceSection ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {showPriceSection && (
                    <div className="space-y-4">
                      <Slider
                        min={0}
                        max={5000000}
                        step={50000}
                        value={priceRange}
                        onValueChange={(value: number[]) =>
                          setPriceRange(value as [number, number])
                        }
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>{formatPriceVND(priceRange[0])}</span>
                        <span>-</span>
                        <span>{formatPriceVND(priceRange[1])}</span>
                      </div>

                      {/* Quick price filters */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPriceRange([0, 500000])}
                          className="text-xs rounded-sm"
                        >
                          Dưới 500K
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPriceRange([500000, 1000000])}
                          className="text-xs rounded-sm"
                        >
                          500K - 1M
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPriceRange([1000000, 2000000])}
                          className="text-xs rounded-sm"
                        >
                          1M - 2M
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPriceRange([2000000, 5000000])}
                          className="text-xs rounded-sm"
                        >
                          Trên 2M
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategories.length > 0 ||
                priceRange[0] > 0 ||
                priceRange[1] < 5000000) && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-medium mb-3">
                    Bộ lọc đang áp dụng:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((catId) => {
                      const category = categories.find(
                        (c: CategoryResponseDto) => c.id === catId
                      );
                      return category ? (
                        <span
                          key={catId}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-primary/10 text-primary rounded-full"
                        >
                          {category.title}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-primary/70"
                            onClick={() => handleCategoryToggle(catId)}
                          />
                        </span>
                      ) : null;
                    })}
                    {(priceRange[0] > 0 || priceRange[1] < 5000000) && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-primary/10 text-primary rounded-full">
                        {formatPriceVND(priceRange[0])} -{" "}
                        {formatPriceVND(priceRange[1])}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-primary/70"
                          onClick={() => setPriceRange([0, 5000000])}
                        />
                      </span>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Card key={i} className="p-4">
                    <Skeleton className="w-full h-64 mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-5 w-1/2" />
                  </Card>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <Card className="p-12 text-center shadow-none">
                <div className="text-slate-400 mb-4">
                  <Filter className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">
                    Không tìm thấy sản phẩm
                  </h3>
                  <p className="text-slate-500">
                    Thử điều chỉnh bộ lọc hoặc xóa một số tiêu chí
                  </p>
                </div>
                <Button onClick={handleClearFilters} variant="outline">
                  Xóa bộ lọc
                </Button>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedProducts.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {productsData?.data?.paginate && (
                  <div className="mt-8 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>

                        {Array.from(
                          {
                            length: productsData.data.paginate.totalPage || 1,
                          },
                          (_, i) => i + 1
                        )
                          .filter((page) => {
                            const totalPages =
                              productsData.data.paginate.totalPage || 1;
                            // Show first page, last page, current page and pages around it
                            return (
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 &&
                                page <= currentPage + 1)
                            );
                          })
                          .map((page, index, array) => {
                            // Add ellipsis
                            const showEllipsisBefore =
                              index > 0 && page - array[index - 1] > 1;
                            return (
                              <>
                                {showEllipsisBefore && (
                                  <PaginationItem key={`ellipsis-${page}`}>
                                    <span className="px-4">...</span>
                                  </PaginationItem>
                                )}
                                <PaginationItem key={page}>
                                  <PaginationLink
                                    onClick={() => setCurrentPage(page)}
                                    isActive={currentPage === page}
                                    className="cursor-pointer"
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              </>
                            );
                          })}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(
                                  productsData.data.paginate.totalPage || 1,
                                  prev + 1
                                )
                              )
                            }
                            className={
                              currentPage ===
                              (productsData.data.paginate.totalPage || 1)
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductList;
