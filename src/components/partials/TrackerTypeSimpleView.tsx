import React from 'react';
import moment from 'moment';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {TrackerSimpleItem} from 'src/types/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { triggerPrompt } from '../../utils/utils';

interface TrackerTypeSimpleViewProps {
  trackerName?: string;
  chartData: any[];
  trackerItems: TrackerSimpleItem[];
  onDeleteTrackerItem(id: number): void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  // console.log('active, payload, label', active, payload, label);
  if(active && payload != null) {
    return (
      <div className={'custom-tooltip'}>
        <p className={'label'}>
          <b>{payload[0].payload.id}</b>
          <br />
          Count: {payload[0].payload.count}
        </p>
      </div>
    );
  }

  return null;
};

const TrackerTypeSimpleView = ({
  trackerName,
  chartData,
  trackerItems,
  onDeleteTrackerItem,
}: TrackerTypeSimpleViewProps) => {console.log('chartData', chartData);
  return (
    <div className={'SliderItem'}>
      <h3>{trackerName}</h3>
      {chartData ? (
        <div className={'TrackerView__chart'}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray={'3 3'} />
              <XAxis dataKey={'label'} />
              <YAxis />
              <Tooltip content={<CustomTooltip />}/>
              <Legend />
              <Bar dataKey={'count'} fill={'#999'} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : undefined}


      <div className={'TrackerView__wrap--items'}>
        {trackerItems.map(item => (
          <div className={'TrackerView__item'} key={item.id}>
            {moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')}
            &nbsp;
            <button
              className={'Btn Btn__small Btn__Danger Btn__icon Btn__icon--left'}
              onClick={() => {
                const confirm = triggerPrompt('Are you sure you want to delete?');
                if(confirm) {
                  onDeleteTrackerItem(item.id)
                }
              }}
            >
              <FontAwesomeIcon icon={'times'} />
              &nbsp;Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export { TrackerTypeSimpleView };
