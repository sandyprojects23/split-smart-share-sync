
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Balance } from "@/pages/Index";
import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";

interface UserBalancesProps {
  balances: Balance[];
  users: User[];
  detailed?: boolean;
}

export const UserBalances: React.FC<UserBalancesProps> = ({ balances, users, detailed = false }) => {
  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || 'Unknown User';
  };

  if (balances.length === 0) {
    return (
      <div className="text-center py-8">
        <Minus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No balances to show</p>
        <p className="text-gray-400 text-sm">Add some expenses to see balances</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {balances.map(balance => {
        const user = users.find(u => u.id === balance.userId);
        if (!user) return null;

        const isPositive = balance.netBalance >= 0;
        const isZero = Math.abs(balance.netBalance) < 0.01;

        return (
          <Card key={balance.userId} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    isZero ? 'text-gray-500' : isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${Math.abs(balance.netBalance).toFixed(2)}
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    {isZero ? (
                      <Badge variant="secondary" className="text-xs">
                        <Minus className="h-3 w-3 mr-1" />
                        Settled Up
                      </Badge>
                    ) : isPositive ? (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Gets Back
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        Owes
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {detailed && (
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  {/* What they owe */}
                  {Object.entries(balance.owes).length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-600 mb-2">Owes:</p>
                      <div className="space-y-2">
                        {Object.entries(balance.owes).map(([userId, amount]) => (
                          <div key={userId} className="flex items-center justify-between bg-red-50 px-3 py-2 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <ArrowRight className="h-4 w-4 text-red-500" />
                              <span className="text-sm text-gray-700">{getUserName(userId)}</span>
                            </div>
                            <span className="font-medium text-red-600">${amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* What they're owed */}
                  {Object.entries(balance.owedBy).length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-2">Owed by:</p>
                      <div className="space-y-2">
                        {Object.entries(balance.owedBy).map(([userId, amount]) => (
                          <div key={userId} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <ArrowRight className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-gray-700">{getUserName(userId)}</span>
                            </div>
                            <span className="font-medium text-green-600">${amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {Object.entries(balance.owes).length === 0 && Object.entries(balance.owedBy).length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No outstanding balances</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
