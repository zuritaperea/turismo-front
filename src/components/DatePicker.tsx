import { Button, Calendar, CalendarCell, CalendarGrid, CalendarGridBody, CalendarGridHeader, CalendarHeaderCell, DateInput, DatePicker, DateSegment, Dialog, Group, Heading, Label, Popover } from 'react-aria-components';
import type { ButtonProps, DateValue, PopoverProps } from 'react-aria-components';
import { ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { I18nProvider } from 'react-aria';


export const DatePickerComponent = ({ setSelectedDate }) => {
  const [date, setDate] = useState<DateValue | null>(null);
  return (
    <div style={{
      display: 'flex',
      alignItems: 'start',
      justifyContent: 'center',
      height: '100px',
    }}>
      <I18nProvider locale="es-AR-u-ca-gregory">
        <DatePicker value={date} onChange={(newDate) => {
          setDate(newDate);
          setSelectedDate(newDate);
        }} style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '200px' }}>
          <Label style={{ color: 'white', cursor: 'default' }}>Date</Label>
          <Group style={{
            display: 'flex',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            transition: 'background 0.3s',
            paddingLeft: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            color: '#4a4a4a',
            border: '1px solid transparent'
          }}>
            <DateInput style={{ display: 'flex', flex: 1, padding: '8px 0' }}>
              {(segment) => (
                <DateSegment
                  segment={segment}
                  style={{
                    padding: '0 4px',
                    fontVariantNumeric: 'tabular-nums',
                    outline: 'none',
                    borderRadius: '2px',
                    backgroundColor: 'transparent',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                />
              )}
            </DateInput>
            <Button style={{
              outline: 'none',
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              color: '#4a4a4a',
              background: 'transparent',
              border: 'none',
              borderLeft: '1px solid #d1c4e9',
              borderRadius: '0 8px 8px 0',
            }}>
              <ChevronsUpDown size={16} />
            </Button>
          </Group>
          <MyPopover>
            <Dialog style={{ padding: '24px', color: '#4a4a4a' }}>
              <Calendar>
                <header style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  paddingBottom: '16px',
                  paddingLeft: '4px',
                  fontFamily: 'serif',
                  width: '100%',
                }}>
                  <Heading style={{ flex: 1, fontWeight: 'bold', fontSize: '20px', marginLeft: '8px' }} />
                  <RoundButton slot="previous">
                    <ChevronLeft />
                  </RoundButton>
                  <RoundButton slot="next">
                    <ChevronRight />
                  </RoundButton>
                </header>
                <CalendarGrid style={{ borderSpacing: '4px', borderCollapse: 'separate' }}>
                  <CalendarGridHeader>
                    {(day) => (
                      <CalendarHeaderCell style={{
                        fontSize: '12px',
                        color: '#757575',
                        fontWeight: 'bold',
                        textAlign: 'center'
                      }}>
                        {day}
                      </CalendarHeaderCell>
                    )}
                  </CalendarGridHeader>
                  <CalendarGridBody>
                    {(date) => (
                      <CalendarCell
                        date={date}
                        style={{
                          width: '36px',
                          height: '36px',
                          outline: 'none',
                          cursor: 'pointer',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'transparent',
                          transition: 'background 0.2s',
                        }}
                        className="hover:bg-gray-100 pressed:bg-gray-200 selected:bg-violet-700 selected:text-white focus-visible:ring-3 ring-violet-600/70 ring-offset-2 outside-month:text-gray-300"
                      />
                    )}
                  </CalendarGridBody>
                </CalendarGrid>
              </Calendar>
            </Dialog>
          </MyPopover>
        </DatePicker>
      </I18nProvider>
    </div>
  );
};

function RoundButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      style={{
        width: '36px',
        height: '36px',
        outline: 'none',
        cursor: 'pointer',
        background: 'transparent',
        color: '#4a4a4a',
        border: 'none',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s',
      }}
    />
  );
}

function MyPopover(props: PopoverProps) {
  return (
    <Popover
      {...props}
      style={{
        overflow: 'auto',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.1)',
        background: 'white',
        transition: 'opacity 0.2s ease-in-out',
      }}
    />
  );
}
