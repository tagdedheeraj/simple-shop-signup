
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ExternalLink } from 'lucide-react';

interface Certificate {
  id: string;
  name: string;
  description: string;
  downloadUrl: string;
  issueDate: string;
  category: string;
}

const certificates: Certificate[] = [
  {
    id: '1',
    name: 'Organic Certification',
    description: 'Certified organic farming practices and quality standards',
    downloadUrl: 'https://drive.google.com/file/d/1i0GJnbsPlGaFs9LmP2DIY_OKkYYWZi9w/view?usp=drive_link',
    issueDate: '2024',
    category: 'Quality Assurance'
  },
  {
    id: '2',
    name: 'Food Safety Certificate',
    description: 'Food safety and hygiene standards compliance',
    downloadUrl: 'https://drive.google.com/file/d/1fPKoHYB8K_pK3so0Y9q-lMcascvE9tne/view?usp=sharing',
    issueDate: '2024',
    category: 'Safety'
  },
  {
    id: '3',
    name: 'ISO 9001:2015 Certificate',
    description: 'Quality management system certification',
    downloadUrl: 'https://drive.google.com/file/d/1sIJueyRfno9ThJcwTlsxpYTqSczoi3o6/view?usp=sharing',
    issueDate: '2024',
    category: 'Quality Management'
  },
  {
    id: '4',
    name: 'HACCP Certification',
    description: 'Hazard Analysis Critical Control Points certification',
    downloadUrl: 'https://drive.google.com/file/d/1oqZKnLDQbQ6ozwwAkQ9qRptOMYR6kZ36/view?usp=sharing',
    issueDate: '2024',
    category: 'Food Safety'
  },
  {
    id: '5',
    name: 'Export License',
    description: 'Government authorized export license for agricultural products',
    downloadUrl: 'https://drive.google.com/file/d/1Zr7oNODXZhpaLDbZXCzLBRLLaxq60bEI/view?usp=sharing',
    issueDate: '2024',
    category: 'Legal Authorization'
  },
  {
    id: '6',
    name: 'Environmental Compliance',
    description: 'Environmental protection and sustainable farming certification',
    downloadUrl: 'https://drive.google.com/file/d/11g_kx6xc_1tOfMyI9LCf2WimsTeUmGga/view?usp=sharing',
    issueDate: '2024',
    category: 'Environmental'
  },
  {
    id: '7',
    name: 'Trade License',
    description: 'Official trade and business operation license',
    downloadUrl: 'https://drive.google.com/file/d/1cIumLGGxKRRY230mSnoMIsB9lR_L0TSq/view?usp=sharing',
    issueDate: '2024',
    category: 'Business License'
  }
];

const Certificates: React.FC = () => {
  const handleViewCertificate = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDownloadCertificate = (url: string) => {
    // Convert Google Drive view link to download link
    const fileId = url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
    if (fileId) {
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      window.open(downloadUrl, '_blank');
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Certificates & Licenses
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            GlobalHarvest is committed to maintaining the highest standards of quality, safety, and compliance. 
            View and download our official certificates and licenses below.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <Card key={certificate.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg leading-tight">
                        {certificate.name}
                      </CardTitle>
                      <div className="text-sm text-gray-500 mt-1">
                        {certificate.category} • {certificate.issueDate}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {certificate.description}
                </CardDescription>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewCertificate(certificate.downloadUrl)}
                    className="flex items-center gap-2 flex-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDownloadCertificate(certificate.downloadUrl)}
                    className="flex items-center gap-2 flex-1"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Section */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Trusted & Verified
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            All our certificates are issued by recognized authorities and regulatory bodies. 
            We maintain transparency in our operations and regularly update our certifications 
            to ensure compliance with the latest standards.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Certificates;
