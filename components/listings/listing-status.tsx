import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Package } from 'lucide-react';

export type ListingStatus = 'available' | 'pending' | 'sold';

interface ListingStatusBadgeProps {
  status: ListingStatus;
  className?: string;
}

export function ListingStatusBadge({ status, className }: ListingStatusBadgeProps) {
  const getStatusConfig = (status: ListingStatus) => {
    switch (status) {
      case 'available':
        return {
          label: 'Available',
          variant: 'default' as const,
          icon: Package,
          className: 'bg-green-100 text-green-800 hover:bg-green-200',
        };
      case 'pending':
        return {
          label: 'Pending',
          variant: 'secondary' as const,
          icon: Clock,
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        };
      case 'sold':
        return {
          label: 'Sold',
          variant: 'destructive' as const,
          icon: CheckCircle,
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        };
      default:
        return {
          label: 'Unknown',
          variant: 'outline' as const,
          icon: Package,
          className: 'bg-gray-100 text-gray-600',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant} 
      className={`${config.className} ${className} flex items-center gap-1 text-xs font-medium`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}

interface ListingStatusIndicatorProps {
  status: ListingStatus;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ListingStatusIndicator({ 
  status, 
  showText = true, 
  size = 'md' 
}: ListingStatusIndicatorProps) {
  const getStatusConfig = (status: ListingStatus) => {
    switch (status) {
      case 'available':
        return {
          label: 'Available for purchase',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          dotColor: 'bg-green-500',
        };
      case 'pending':
        return {
          label: 'Payment in progress',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          dotColor: 'bg-yellow-500',
        };
      case 'sold':
        return {
          label: 'Sold',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          dotColor: 'bg-gray-500',
        };
      default:
        return {
          label: 'Status unknown',
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          dotColor: 'bg-gray-400',
        };
    }
  };

  const config = getStatusConfig(status);
  
  const sizeClasses = {
    sm: {
      dot: 'w-2 h-2',
      text: 'text-xs',
      container: 'gap-1.5',
    },
    md: {
      dot: 'w-3 h-3',
      text: 'text-sm',
      container: 'gap-2',
    },
    lg: {
      dot: 'w-4 h-4',
      text: 'text-base',
      container: 'gap-2.5',
    },
  };

  return (
    <div className={`flex items-center ${sizeClasses[size].container}`}>
      <div 
        className={`${sizeClasses[size].dot} rounded-full ${config.dotColor} flex-shrink-0`}
        aria-hidden="true"
      />
      {showText && (
        <span className={`${config.color} ${sizeClasses[size].text} font-medium`}>
          {config.label}
        </span>
      )}
    </div>
  );
}
