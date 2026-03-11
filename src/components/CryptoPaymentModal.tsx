import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, ArrowLeft, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CRYPTO_ADDRESSES, CRYPTO_OPTIONS, PRIMARY_CRYPTOS } from '@/config/cryptoPayments';

interface CryptoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditsAmount?: number;
  priceUSD?: number;
}

export function CryptoPaymentModal({ 
  isOpen, 
  onClose,
  creditsAmount = 200,
  priceUSD = 280
}: CryptoPaymentModalProps) {
  const { toast } = useToast();
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleCopyAddress = (address: string, symbol: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    toast({
      title: `${symbol} address copied`,
      description: 'Address copied to clipboard',
    });
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const crypto = selectedCrypto ? CRYPTO_ADDRESSES[selectedCrypto] : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pay with Cryptocurrency</DialogTitle>
          <DialogDescription>
            Send any amount to one of our crypto wallets. After payment is confirmed, your {creditsAmount} credits will be activated.
          </DialogDescription>
        </DialogHeader>

        {!selectedCrypto ? (
          // Crypto Selection View
          <div className="space-y-4">
            {/* Primary Cryptos */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Popular Payment Methods</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PRIMARY_CRYPTOS.map((key) => {
                  const crypto = CRYPTO_ADDRESSES[key];
                  return (
                    <Button
                      key={key}
                      variant="outline"
                      className="h-auto flex flex-col items-center gap-2 p-3 hover:border-blue-300 hover:bg-blue-50"
                      onClick={() => setSelectedCrypto(key)}
                    >
                      <span className="text-2xl">{crypto.icon}</span>
                      <div className="text-center">
                        <div className="font-semibold text-sm">{crypto.symbol}</div>
                        <div className="text-xs text-gray-500">{crypto.name}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* All Cryptos */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">All Supported Cryptocurrencies</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-96 overflow-y-auto pr-2">
                {CRYPTO_OPTIONS.map((crypto) => (
                  <Button
                    key={crypto.key}
                    variant={PRIMARY_CRYPTOS.includes(crypto.key) ? "outline" : "ghost"}
                    className="h-auto flex flex-col items-center gap-1 p-2 text-xs hover:bg-gray-100"
                    onClick={() => setSelectedCrypto(crypto.key)}
                  >
                    <span className="text-xl">{crypto.icon}</span>
                    <div className="font-semibold">{crypto.symbol}</div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <strong>Network fees apply.</strong> The amount you send will depend on the cryptocurrency and network you use. Please verify the address before sending.
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Payment Instructions View
          <div className="space-y-4">
            <Button
              variant="ghost"
              className="gap-2 -ml-2"
              onClick={() => setSelectedCrypto(null)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to payment methods
            </Button>

            {crypto && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{crypto.icon}</span>
                      <div>
                        <CardTitle className="text-xl">{crypto.name}</CardTitle>
                        <p className="text-sm text-gray-600">{crypto.network}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Amount Info */}
                  <div className="bg-white rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Order Amount:</span>
                      <span className="font-semibold">${priceUSD.toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Credits:</span>
                      <span className="font-semibold">{creditsAmount} credits</span>
                    </div>
                    <div className="text-xs text-gray-500 pt-2 border-t">
                      <strong>Note:</strong> Due to price fluctuations, the exact amount in {crypto.symbol} may vary. Please send at least the calculated equivalent amount.
                    </div>
                  </div>

                  {/* Wallet Address */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Wallet Address</label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white rounded-lg p-3 font-mono text-sm break-all border border-gray-200">
                        {crypto.address}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-shrink-0"
                        onClick={() => handleCopyAddress(crypto.address, crypto.symbol)}
                      >
                        {copiedAddress === crypto.address ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Memo/Tag if needed */}
                  {crypto.memo && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Memo / Tag (Required)</label>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-white rounded-lg p-3 font-mono text-sm border border-gray-200">
                          {crypto.memo}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-shrink-0"
                          onClick={() => handleCopyAddress(crypto.memo || '', 'Memo')}
                        >
                          {copiedAddress === crypto.memo ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
                        ⚠️ This memo is <strong>required</strong> for your payment to be attributed to your account.
                      </p>
                    </div>
                  )}

                  {/* Instructions */}
                  <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                    <h4 className="font-semibold text-gray-900">Payment Instructions:</h4>
                    <ol className="space-y-2 text-gray-700">
                      <li className="flex gap-2">
                        <span className="font-semibold text-blue-600 flex-shrink-0">1.</span>
                        <span>Open your {crypto.symbol} wallet or exchange account</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-blue-600 flex-shrink-0">2.</span>
                        <span>Send exactly {crypto.symbol} to the address above</span>
                      </li>
                      {crypto.memo && (
                        <li className="flex gap-2">
                          <span className="font-semibold text-blue-600 flex-shrink-0">3.</span>
                          <span>Include the memo/tag above in your transaction</span>
                        </li>
                      )}
                      <li className="flex gap-2">
                        <span className={crypto.memo ? 'font-semibold text-blue-600 flex-shrink-0' : 'font-semibold text-blue-600 flex-shrink-0'}>
                          {crypto.memo ? '4.' : '3.'}
                        </span>
                        <span>Wait for network confirmation (usually 5-30 minutes)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className={crypto.memo ? 'font-semibold text-blue-600 flex-shrink-0' : 'font-semibold text-blue-600 flex-shrink-0'}>
                          {crypto.memo ? '5.' : '4.'}
                        </span>
                        <span>Your credits will be automatically added to your account</span>
                      </li>
                    </ol>
                  </div>

                  {/* Warning */}
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-4 flex gap-3">
                      <AlertCircle className="h-5 w-5 text-red-700 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-red-800">
                        <strong>Important:</strong> Double-check the wallet address before sending. We cannot recover funds sent to incorrect addresses.
                      </div>
                    </CardContent>
                  </Card>

                  <Button 
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
                  >
                    Close
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
