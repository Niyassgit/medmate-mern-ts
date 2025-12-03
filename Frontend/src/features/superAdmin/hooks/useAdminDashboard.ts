import { useCallback } from 'react';
import useFetchItem from '@/hooks/useFetchItem';
import { 
  statsSummary, 
  userDistribution, 
  getUserGrowth, 
  getRevenueByTier, 
  getRecentSubscriptions 
} from '../api/superAdminApi';
import { 
  StatsSummary, 
  UserDistribution, 
  UserGrowth, 
  RevenueByTier, 
  Subscription 
} from '../dto/AdminDashboardTypes';

export const useStatsSummary = (startDate?: string, endDate?: string) => {
  const fetchFn = useCallback(() => statsSummary(startDate, endDate), [startDate, endDate]);
  const { data, loading, error, setData } = useFetchItem<StatsSummary>(fetchFn);
  
  return { 
    data, 
    isLoading: loading, 
    error,
    setData 
  };
};

export const useUserDistribution = (startDate?: string, endDate?: string) => {
  const fetchFn = useCallback(() => userDistribution(startDate, endDate), [startDate, endDate]);
  const { data, loading, error, setData } = useFetchItem<UserDistribution>(fetchFn);
  
  return { 
    data, 
    isLoading: loading, 
    error,
    setData 
  };
};

export const useUserGrowth = (year?: string) => {
  const fetchFn = useCallback(() => getUserGrowth(year), [year]);
  const { data, loading, error, setData } = useFetchItem<UserGrowth>(fetchFn);
  
  return { 
    data, 
    isLoading: loading, 
    error,
    setData 
  };
};

export const useRevenueByTier = (startDate?: string, endDate?: string) => {
  const fetchFn = useCallback(() => getRevenueByTier(startDate, endDate), [startDate, endDate]);
  const { data, loading, error, setData } = useFetchItem<RevenueByTier>(fetchFn);
  
  return { 
    data, 
    isLoading: loading, 
    error,
    setData 
  };
};

export const useRecentSubscriptions = (limit: number = 20) => {
  const fetchFn = useCallback(() => getRecentSubscriptions(limit), [limit]);
  const { data, loading, error, setData } = useFetchItem<Subscription[]>(fetchFn);
  
  return { 
    data, 
    isLoading: loading, 
    error,
    setData 
  };
};

