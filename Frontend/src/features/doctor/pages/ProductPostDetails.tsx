import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useFetchItem from "@/hooks/useFetchItem";
import { getPostDetails } from "../api";
import { PostDetailsResponseDTO } from "../dto/PostDetailsResponseDTO";
import { SpinnerButton } from "@/components/shared/SpinnerButton";

const ProductPostDetails = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const { postId } = useParams<{ postId: string }>();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchPostDetails = useCallback(async () => {
    if (!postId) {
      throw new Error("Post ID is missing");
    }
    const res = await getPostDetails(postId);
    return res.data as PostDetailsResponseDTO;
  }, [postId]);

  const {
    data: response,
    loading,
    error,
  } = useFetchItem<PostDetailsResponseDTO>(fetchPostDetails);
  const handleNavigate = (id: string) => {
    setLoadingId(id);
    setTimeout(() => {
      navigate(`/doctor/feed/${id}`);
    }, 300);
  };

  if (loading) return <SpinnerButton />;
  if (error || !response)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Something went wrong
      </div>
    );

  const { postDetails, repDetails, relatedProducts } = response;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b border-gray-200 
        bg-white/80 backdrop-blur-md 
        supports-[backdrop-filter]:bg-white/60"
      >
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <Card className="overflow-hidden shadow-md transition-shadow hover:shadow-lg">
              <div className="aspect-square bg-gray-100 p-8">
                <img
                  src={postDetails.imageUrl[selectedImage]}
                  alt={postDetails.title}
                  className="h-full w-full object-contain"
                />
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              {postDetails.imageUrl.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 bg-gray-100 p-2 transition-all ${
                    selectedImage === idx
                      ? "border-blue-500 shadow-md"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Product ${idx + 1}`}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
                {postDetails.brand}
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                {postDetails.title}
              </h1>
              <div className="mt-3 flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-blue-500 text-blue-500"
                  />
                ))}
                <span className="text-sm text-gray-500">(4.8)</span>
              </div>
            </div>

            <p className="text-base leading-relaxed text-gray-700">
              {postDetails.description}
            </p>

            {/* Key Benefits */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Key Benefits
              </h3>
              <div className="space-y-3">
                {postDetails.useCases.map((useCase, idx) => (
                  <div key={idx} className="flex gap-3">
                    <ChevronRight className="h-5 w-5 shrink-0 text-blue-500" />
                    <p className="text-sm text-gray-700">{useCase}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Representative Card */}
            <Card className="p-6 shadow-md cursor-pointer" onClick={()=>navigate(`/doctor/rep/details/${repDetails.id}`)}>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Your Representative
              </h3>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={repDetails.profileImage || undefined}
                    alt={repDetails.name}
                  />
                  <AvatarFallback>{repDetails.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{repDetails.name}</p>
                  <p className="text-sm text-gray-500">
                    {repDetails.companyName}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {repDetails.about}
                  </p>
                </div>
              </div>
            </Card>

            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 transition-opacity text-lg h-12 text-white">
              {repDetails.isConnected
                ? "Message Representative"
                : "Contact Representative"}
            </Button>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="ingredients" className="w-full">
            <TabsList className="w-full justify-start border-b bg-transparent rounded-none h-auto p-0">
              <TabsTrigger
                value="ingredients"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
              >
                Ingredients
              </TabsTrigger>
              <TabsTrigger
                value="usage"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
              >
                How to Use
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
              >
                Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients" className="mt-6">
              <Card className="p-6">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Active Ingredients
                </h3>
                <div className="space-y-3">
                  {postDetails.ingredients.map((ingredient, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 rounded-lg bg-gray-100 p-3"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-gray-700">{ingredient}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="mt-6">
              <Card className="p-6">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Directions for Use
                </h3>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <ol className="space-y-3 list-decimal pl-5">
                    <li>Cleanse your face thoroughly before application.</li>
                    <li>Apply generously 15 minutes before sun exposure.</li>
                    <li>
                      Spread evenly on face, neck, and other exposed areas.
                    </li>
                    <li>Reapply every 2–3 hours or after swimming/sweating.</li>
                    <li>Use daily for optimal protection.</li>
                  </ol>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <Card className="p-6">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Product Details
                </h3>
                <p className="leading-relaxed text-gray-700">
                  {postDetails.termsOfUse}
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {relatedProducts.map((product) => (
                <Card
                  key={product.id}
                  onClick={() => handleNavigate(product.id)}
                  className="group cursor-pointer overflow-hidden shadow-md transition-all hover:shadow-lg"
                >
                  {loadingId === product.id && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                      <SpinnerButton compact label="" />
                    </div>
                  )}

                  <div className="aspect-square overflow-hidden bg-gray-100 p-4">
                    <img
                      src={product.productImage || "/placeholder.png"}
                      alt={product.title}
                      className="h-full w-full object-contain transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <Badge variant="outline" className="mb-2">
                      {product.brand}
                    </Badge>
                    <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
                      {product.title}
                    </h3>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductPostDetails;
