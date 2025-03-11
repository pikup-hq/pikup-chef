import React from 'react';
import { View } from 'react-native';
import { Package } from 'lucide-react-native';
import { MediumText } from '@/components/common/AppText';

interface NoDataViewProps {
  message: string;
  icon?: React.ReactNode;
}

const NoDataView: React.FC<NoDataViewProps> = ({ 
  message, 
  icon = <Package size={48} color="#CCCCCC" /> 
}) => {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
      backgroundColor: '#F8F8F8',
      borderRadius: 12,
      marginVertical: 20
    }}>
      {icon}
      <MediumText style={{ 
        color: '#666666', 
        marginTop: 16, 
        textAlign: 'center' 
      }}>
        {message}
      </MediumText>
    </View>
  );
};

export default NoDataView;