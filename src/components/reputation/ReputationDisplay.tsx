import React from 'react';
import { TrendingUp, Award, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ReputationMetrics {
  totalScore: number;
  casesResolved: number;
  successfulResolutions: number;
  averageResolutionTime: number;
  stakingRewards: number;
  penaltiesReceived: number;
  lastUpdated: string;
  isSlashed: boolean;
  rank: string;
  percentile: number;
}

interface ReputationDisplayProps {
  userAddress: string;
  metrics: ReputationMetrics;
  showDetails?: boolean;
}

const ReputationDisplay: React.FC<ReputationDisplayProps> = ({
  userAddress,
  metrics,
  showDetails = true
}) => {
  const getReputationLevel = (score: number) => {
    if (score >= 900) return { level: 'Legendary', color: 'text-purple-600', bgColor: 'bg-purple-100' };
    if (score >= 800) return { level: 'Expert', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 600) return { level: 'Experienced', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 400) return { level: 'Competent', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'Novice', color: 'text-gray-600', bgColor: 'bg-gray-100' };
  };

  const successRate = metrics.casesResolved > 0 
    ? Math.round((metrics.successfulResolutions / metrics.casesResolved) * 100)
    : 0;

  const reputationLevel = getReputationLevel(metrics.totalScore);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Reputation Profile</h2>
          <p className="text-sm text-gray-500 font-mono">{userAddress}</p>
        </div>
        {metrics.isSlashed && (
          <div className="flex items-center text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Slashed
          </div>
        )}
      </div>

      {/* Main Score Display */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4">
          <span className="text-2xl font-bold">{metrics.totalScore}</span>
        </div>
        <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${reputationLevel.color} ${reputationLevel.bgColor}`}>
          {reputationLevel.level}
        </div>
        <div className="text-sm text-gray-500 mt-2">
          Top {metrics.percentile}% • Rank: {metrics.rank}
        </div>
      </div>

      {showDetails && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{metrics.casesResolved}</div>
              <div className="text-sm text-gray-500">Cases Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{successRate}%</div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.averageResolutionTime}d</div>
              <div className="text-sm text-gray-500">Avg. Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.stakingRewards}</div>
              <div className="text-sm text-gray-500">Rewards</div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="font-medium">Successful Resolutions</span>
              </div>
              <span className="text-lg font-semibold">{metrics.successfulResolutions}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-500 mr-3" />
                <span className="font-medium">Average Resolution Time</span>
              </div>
              <span className="text-lg font-semibold">{metrics.averageResolutionTime} days</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Award className="w-5 h-5 text-purple-500 mr-3" />
                <span className="font-medium">Staking Rewards Earned</span>
              </div>
              <span className="text-lg font-semibold">{metrics.stakingRewards} tokens</span>
            </div>

            {metrics.penaltiesReceived > 0 && (
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 text-red-500 mr-3" />
                  <span className="font-medium">Penalties Received</span>
                </div>
                <span className="text-lg font-semibold text-red-600">{metrics.penaltiesReceived}</span>
              </div>
            )}
          </div>

          {/* Reputation Trend */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">Reputation Trend</span>
              </div>
              <span className="text-sm text-blue-700">
                Last updated: {new Date(metrics.lastUpdated).toLocaleDateString()}
              </span>
            </div>
            <div className="mt-2 text-sm text-blue-800">
              Your reputation has been steadily growing based on consistent performance and timely resolutions.
            </div>
          </div>

          {/* Tips for Improvement */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Tips to Improve Your Reputation</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Resolve cases within the recommended timeframe</li>
              <li>• Provide detailed and fair reasoning for decisions</li>
              <li>• Maintain consistent activity and availability</li>
              <li>• Stake additional tokens to increase credibility</li>
              <li>• Specialize in specific dispute categories</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

interface ReputationLeaderboardProps {
  topArbitrators: Array<{
    address: string;
    score: number;
    casesResolved: number;
    successRate: number;
    rank: number;
  }>;
  currentUserRank?: number;
}

const ReputationLeaderboard: React.FC<ReputationLeaderboardProps> = ({
  topArbitrators,
  currentUserRank
}) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Reputation Leaderboard</h3>
      
      <div className="space-y-3">
        {topArbitrators.map((arbitrator) => (
          <div
            key={arbitrator.address}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center mr-3">
                <span className="text-lg font-semibold">
                  {getRankIcon(arbitrator.rank)}
                </span>
              </div>
              <div>
                <div className="font-mono text-sm">
                  {arbitrator.address.slice(0, 6)}...{arbitrator.address.slice(-4)}
                </div>
                <div className="text-xs text-gray-500">
                  {arbitrator.casesResolved} cases • {arbitrator.successRate}% success
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">{arbitrator.score}</div>
              <div className="text-xs text-gray-500">reputation</div>
            </div>
          </div>
        ))}
      </div>

      {currentUserRank && currentUserRank > 10 && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-center text-sm text-gray-600">
            Your current rank: #{currentUserRank}
          </div>
        </div>
      )}
    </div>
  );
};

export { ReputationDisplay, ReputationLeaderboard };
export type { ReputationMetrics };
