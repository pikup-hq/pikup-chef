import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Modal, 
  ScrollView
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { MediumText, SmallText } from '@/components/common/AppText';
import COLORS from '@/constants/colors';

export type TimeOption = {
  label: string;
  value: string;
};

export type DayOption = {
  label: string;
  value: string;
};

export const DAYS: DayOption[] = [
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
  { label: 'Sunday', value: 'sunday' },
];

// Generate time options in 30-minute intervals
export const generateTimeOptions = (): TimeOption[] => {
  const options: TimeOption[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      const label = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
      options.push({ label, value: timeValue });
    }
  }
  return options;
};

export const TIME_OPTIONS = generateTimeOptions();

type SelectModalProps = {
  visible: boolean;
  onClose: () => void;
  options: Array<{ label: string; value: string }>;
  onSelect: (value: string) => void;
  selectedValue?: string;
};

const SelectModal: React.FC<SelectModalProps> = ({
  visible,
  onClose,
  options,
  onSelect,
  selectedValue
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end'
        }}
        onPress={onClose}
      >
        <View style={{ 
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: '70%'
        }}>
          <View style={{ 
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#F4F4F4'
          }}>
            <MediumText style={{}}>Select Option</MediumText>
          </View>
          <ScrollView>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={{ 
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#F4F4F4',
                  backgroundColor: selectedValue === option.value ? '#F8F8F8' : '#FFFFFF'
                }}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <MediumText style={{ 
                  color: selectedValue === option.value ? COLORS.primary : '#000000'
                }}>
                  {option.label}
                </MediumText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

type SelectInputProps = {
  value?: string;
  placeholder?: string;
  options: Array<{ label: string; value: string }>;
  onSelect: (value: string) => void;
};

const SelectInput: React.FC<SelectInputProps> = ({
  value,
  placeholder = "Select",
  options,
  onSelect
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <>
      <TouchableOpacity
        style={{
          height: 48,
          borderWidth: 1,
          borderColor: COLORS.primary + '40',
          borderRadius: 12,
          paddingHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF'
        }}
        onPress={() => setModalVisible(true)}
      >
        <MediumText style={{ 
          color: selectedOption ? '#000000' : '#AAAAAA',
          fontSize: 13
        }}>
          {selectedOption ? selectedOption.label : placeholder}
        </MediumText>
        <ChevronDown size={20} color="#AAAAAA" />
      </TouchableOpacity>

      <SelectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        options={options}
        onSelect={onSelect}
        selectedValue={value}
      />
    </>
  );
};

export type OpeningTime = {
  day: string;
  openTime: string;
  closeTime: string;
};

type OpeningTimesSelectorProps = {
  selectedDay: string;
  openTime?: string;
  closeTime?: string;
  onDayChange: (day: string) => void;
  onOpenTimeChange: (time: string) => void;
  onCloseTimeChange: (time: string) => void;
};

export default function OpeningTimesSelector({
  selectedDay,
  openTime,
  closeTime,
  onDayChange,
  onOpenTimeChange,
  onCloseTimeChange
}: OpeningTimesSelectorProps) {
  return (
    <View>
      
      <View style={{ 
        flexDirection: 'row', 
        gap: 12
      }}>
        <View>
          <SmallText style={{ 
            marginBottom: 8,
            fontSize: 13,
            color: '#555555'
          }}>
            Day
          </SmallText>
          <SelectInput
            value={selectedDay}
            options={DAYS}
            onSelect={onDayChange}
          />
        </View>

        <View style={{ flex: 1 }}>
          <SmallText style={{ 
            marginBottom: 8,
            fontSize: 13,
            color: '#555555'
          }}>
            Open
          </SmallText>
          <SelectInput
            value={openTime}
            options={TIME_OPTIONS}
            onSelect={onOpenTimeChange}
          />
        </View>

        <View style={{ flex: 1 }}>
          <SmallText style={{ 
            marginBottom: 8,
            fontSize: 13,
            color: '#555555'
          }}>
            Close
          </SmallText>
          <SelectInput
            value={closeTime}
            options={TIME_OPTIONS}
            onSelect={onCloseTimeChange}
          />
        </View>
      </View>
    </View>
  );
}