import React, { useState } from 'react';
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
import './TrackerTypeSimpleNewFormat.scss';
import { Tracker, TrackerSimpleItem } from 'src/types/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { triggerPrompt } from '../../utils/utils';
import { Link } from 'react-router-dom';

const rangeList = [
    {
        val: 7,
        text: 'Week',
    },
    {
        val: 30,
        text: 'Month',
    },
    {
        val: 180,
        text: 'Half Year',
    },
    {
        val: 365,
        text: 'Year',
    },
];

interface TrackerTypeSimpleNewFormatProps {
    tracker: Tracker;
    chartData: any[];
    trackerItems: TrackerSimpleItem[];
    onRangeChange(idx: number): void;
    onAddTrackerItem(): Promise<boolean>;
    textareaValue: string;
    onTextareaValueChange(str: string): void;
    onDeleteTracker(): void;
    onDeleteTrackerItem(id: number): void;
}

const CustomTooltip = ({ active, payload }: any) => {
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

const TrackerTypeSimpleNewFormat = ({
    tracker,
    chartData,
    trackerItems,
    onRangeChange,
    onAddTrackerItem,
    textareaValue,
    onTextareaValueChange,
    onDeleteTracker,
    onDeleteTrackerItem,
}: TrackerTypeSimpleNewFormatProps) => {
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [isAddVisible, setIsAddVisible] = useState<boolean>(false);

    return (
        <div className={'SliderItem'}>
            <div className={'SliderItem__title'}>
                <h3>
                    {tracker.name}

                    <select
                        name={'range'}
                        onChange={(e) => onRangeChange(e.target.value as any as number)}
                    >
                        {rangeList.map(rangeItem => (
                            <option
                                key={rangeItem.val}
                                value={rangeItem.val}
                            >
                                {rangeItem.text}
                            </option>
                        ))}
                    </select>
                    <button
                        type={'button'}
                        className={'Btn Btn__Danger Btn__small'}
                        style={{
                            float: 'right',
                        }}
                        onClick={() => {
                            const confirm = triggerPrompt(`Are you sure you want to delete ${tracker.name}?`);
                            if(confirm) {
                                onDeleteTracker()
                            }
                        }}
                    >
                        <FontAwesomeIcon icon={'times'} />
                    </button>
                </h3>
            </div>
            {chartData ? (
                <div className={'SliderItem__chart'}>
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


            <div className={'SliderItem__items'}>
                {trackerItems.map(item => (
                    <div className={'TrackerView__item'} key={item.id}>
                        <div>
                            {moment(item.created_at).format('MM/DD h:mma')}&nbsp;
                            <span className={'TrackerView__item--note'}>- {item.note}</span>
                        </div>
                        <div>
                            <Link to={`/tracker-item/${item.id}`}>
                                <FontAwesomeIcon icon={'eye'} />
                            </Link>

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
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`${isAddVisible ? 'SliderItem__cta open' : 'SliderItem__cta'}`}>
                <span
                    className={'SliderItem__cta--toggle'}
                    onClick={() => setIsAddVisible(!isAddVisible)}
                >
                    <FontAwesomeIcon icon={'plus'} />
                </span>
                <div className={'SliderItem__cta--hidden'}>
                    <textarea
                        value={textareaValue}
                        onChange={(e) => onTextareaValueChange(e.target.value)}
                    />
                    <button
                        type={'button'}
                        disabled={isDisabled}
                        className={'Btn Btn__Primary Column'}
                        onClick={() => {
                            setIsDisabled(true);
                            const response = onAddTrackerItem();
                            response.then(() => {
                                setIsDisabled(false);
                            });
                        }}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}

export { TrackerTypeSimpleNewFormat };
