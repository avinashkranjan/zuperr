import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { get } from "@api/index";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

function Companies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = React.useState<any[]>([]);

  const tailwindBgColors = [
    "bg-blue-50",
    "bg-green-50",
    "bg-yellow-50",
    "bg-purple-50",
    "bg-orange-50",
    "bg-pink-50",
    "bg-red-50",
    "bg-teal-50",
    "bg-indigo-50",
    "bg-cyan-50",
  ];

  function getRandomBgColor(): string {
    const index = Math.floor(Math.random() * tailwindBgColors.length);
    return tailwindBgColors[index];
  }

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response: any = await get("/employer");
        const companiesWithColors = response.data.map((company: any) => ({
          ...company,
          bgColor: getRandomBgColor(),
        }));
        console.log("Fetched companies:", companiesWithColors);
        setCompanies(companiesWithColors);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };

  const [selectedCompany, setSelectedCompany] = React.useState<any | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleViewCompany = (company: any) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {companies.map((company, index) => (
        <Card
          key={index}
          className={`${company.bgColor} flex flex-col rounded-lg shadow-md`}
        >
          <CardHeader className="border-b border-gray-200 px-4 py-2 flex justify-start items-start">
            <Badge className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {formatDate(company.createdAt)}
            </Badge>
          </CardHeader>

          <CardContent className="flex-1 p-4 flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 rounded-md">
                <AvatarImage
                  src={
                    company.companyLogo
                      ? `https://your-s3-or-cdn-base-url/${company.companyLogo}`
                      : undefined
                  }
                  alt={`${company.companyName || company?.firstname}'s logo`}
                />
                <AvatarFallback className="text-sm font-medium bg-gray-200 text-gray-600">
                  {(company?.firstname?.[0].toUpperCase() || "") +
                    (company.lastname?.[0].toUpperCase() || "")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold">
                  {company.companyName ||
                    `${company?.firstname} ${company.lastname}`}
                </CardTitle>
                <p className="text-sm text-gray-500">{company.email}</p>
              </div>
            </div>

            <div className="text-sm font-medium text-gray-700">
              GST Verified:{" "}
              <span
                className={`font-semibold ${
                  company.isGstVerified ? "text-green-600" : "text-red-500"
                }`}
              >
                {company.isGstVerified ? "Yes" : "No"}
              </span>
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="h-[14px]" />
              <span>India</span>
            </div>

            <div className="text-sm text-gray-600">
              Mobile:{" "}
              <span className="font-medium">{company.mobileNumber}</span>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end p-4 border-t">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full"
                onClick={() => {
                  // Navigate to company details page if companyId exists
                  if (company.companyId) {
                    navigate(`/company/${company.companyId}`);
                  } else {
                    // Fallback to modal for employers not yet migrated
                    handleViewCompany(company);
                  }
                }}
              >
                View Company
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      ))}

      {isModalOpen && selectedCompany && (
        <motion.div
          className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-black"
              onClick={closeModal}
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-16 h-16 rounded-md">
                <AvatarImage
                  src={
                    selectedCompany.companyLogo
                      ? `https://your-s3-or-cdn-base-url/${selectedCompany.companyLogo}`
                      : undefined
                  }
                  alt={`${
                    selectedCompany.companyName || selectedCompany?.firstname
                  }'s logo`}
                />
                <AvatarFallback className="text-sm font-medium bg-gray-200 text-gray-600">
                  {(selectedCompany?.firstname?.[0].toUpperCase() || "") +
                    (selectedCompany.lastname?.[0].toUpperCase() || "")}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-xl font-semibold">
                  {selectedCompany.companyName ||
                    `${selectedCompany?.firstname} ${selectedCompany.lastname}`}
                </h2>
                <p className="text-sm text-gray-500">{selectedCompany.email}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Mobile:</span>{" "}
                {selectedCompany.mobileNumber}
              </p>
              <p>
                <span className="font-semibold">GST Number:</span>{" "}
                {selectedCompany.gstNumber}
              </p>
              <p>
                <span className="font-semibold">GST Verified:</span>{" "}
                <span
                  className={`${
                    selectedCompany.isGstVerified
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {selectedCompany.isGstVerified ? "Yes" : "No"}
                </span>
              </p>
              <p>
                <span className="font-semibold">Registered On:</span>{" "}
                {formatDate(selectedCompany.createdAt)}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {selectedCompany.email}
              </p>
              <p>
                <span className="font-semibold">Location:</span> India
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Companies;
