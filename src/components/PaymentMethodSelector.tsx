import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Wallet } from 'lucide-react';
import { CRYPTO_ADDRESSES, PRIMARY_CRYPTOS } from '@/config/cryptoPayments';

interface PaymentMethodSelectorProps {
  onSelectStripe: () => void;
  onSelectCrypto: (cryptoKey: string) => void;
  isLoading?: boolean;
}

export function PaymentMethodSelector({
  onSelectStripe,
  onSelectCrypto,
  isLoading = false
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Select Payment Method</h3>
        <p className="text-sm text-gray-600">Choose how you'd like to pay</p>
      </div>

      {/* Stripe Option */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
        <CardContent className="p-4">
          <Button
            onClick={onSelectStripe}
            disabled={isLoading}
            className="w-full h-auto flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6" />
              <div className="text-left">
                <div>Credit Card / Stripe</div>
                <div className="text-xs opacity-90">Cards, Apple Pay, Google Pay</div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white text-blue-600">Recommended</Badge>
          </Button>
        </CardContent>
      </Card>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-600">Or pay with crypto</span>
        </div>
      </div>

      {/* Crypto Options */}
      <div className="space-y-3">
        <p className="text-sm text-gray-600 font-medium">Popular Payment Methods</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {PRIMARY_CRYPTOS.map((key) => {
            const crypto = CRYPTO_ADDRESSES[key];
            return (
              <Button
                key={key}
                onClick={() => onSelectCrypto(key)}
                disabled={isLoading}
                variant="outline"
                className="h-auto flex flex-col items-center gap-2 p-3 border-2 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <span className="text-2xl">{crypto.icon}</span>
                <div className="text-center">
                  <div className="font-semibold text-xs">{crypto.symbol}</div>
                  <div className="text-xs text-gray-500 max-w-20 truncate">{crypto.name}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4 text-sm text-blue-900">
          <div className="flex gap-2">
            <Wallet className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Crypto payments are manual.</strong> You'll receive detailed instructions on which wallet address to send your cryptocurrency to.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
