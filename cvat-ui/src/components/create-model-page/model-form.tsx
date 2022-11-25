// Copyright (C) 2022 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';

import React, { useCallback, useState } from 'react';
import { Store } from 'antd/lib/form/interface';
import { Row, Col } from 'antd/lib/grid';
import Form from 'antd/lib/form';
import Button from 'antd/lib/button';
import Select from 'antd/lib/select';
import notification from 'antd/lib/notification';

import { ModelsProviderType } from 'utils/enums';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { createModelAsync } from 'actions/models-actions';
import RoboflowConfiguration from './providers/roboflow-configuration';

const modelProviders = {
    [ModelsProviderType.ROBOFLOW]: <RoboflowConfiguration />,
};

function ModelForm(): JSX.Element {
    const [form] = Form.useForm();
    const history = useHistory();
    const dispatch = useDispatch();
    const [currentProvider, setCurrentProvider] = useState<JSX.Element | null>(null);
    const onChangeProviderValue = useCallback((provider: ModelsProviderType) => {
        setCurrentProvider(modelProviders[provider]);
    }, []);

    const handleSubmit = useCallback(async (): Promise<void> => {
        try {
            const values: Store = await form.validateFields();
            const rawModelData = {
                api_key: values.apiKey,
                provider: values.provider.toLowerCase(),
                url: values.url,
            };
            await dispatch(createModelAsync(rawModelData));
            form.resetFields();
            notification.info({
                message: 'Model has been successfully created',
                className: 'cvat-notification-create-model-success',
            });
        } catch (e) {
            console.log(e);
        }
    }, []);

    return (
        <Row className='cvat-create-model-form-wrapper'>
            <Col span={24}>
                <Form
                    form={form}
                    layout='vertical'
                >
                    <Form.Item
                        label='Provider'
                        name='provider'
                        rules={[{ required: true, message: 'Please, specify model provider' }]}
                    >
                        <Select
                            virtual={false}
                            onChange={onChangeProviderValue}
                            className='cvat-select-model-provider'
                        >
                            <Select.Option value={ModelsProviderType.ROBOFLOW}>
                                <span className='cvat-cloud-storage-select-provider'>
                                    Roboflow
                                </span>
                            </Select.Option>
                        </Select>
                    </Form.Item>
                    <Col offset={1}>
                        {currentProvider}
                    </Col>
                </Form>
            </Col>
            <Col span={24}>
                <Row justify='end'>
                    <Col>
                        <Button onClick={() => history.goBack()}>
                            Cancel
                        </Button>
                    </Col>
                    <Col offset={1}>
                        <Button type='primary' onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default React.memo(ModelForm);
