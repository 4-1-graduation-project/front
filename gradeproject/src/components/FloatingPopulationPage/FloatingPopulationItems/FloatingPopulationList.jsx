import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import * as A from "../../userManagementPage/userManagementItems/MemberListCss";
import * as S from "../../userReportPage/userReportItems/ReportListCss";
import * as K from "./FloatingPopulationListcss";
import * as Z from "../../mapDataManagementPage/mapDataItems/MapDataListCss";

export default function FloatingPopulationList() {
    const [floatingPopulations, setFloatingPopulations] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [newFloatingPopulationData, setNewFloatingPopulationData] = useState({
        measurementTime: '',
        autonomousDistrict: '',
        administrativeDistrict: '',
        numberOfVisitors: ''
    });

    useEffect(() => {
        fetch('http://localhost:3000/floatingPopulation/Data.json')
            .then(response => response.json())
            .then(data => setFloatingPopulations(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        document.body.style = `overflow: hidden`;
        return () => document.body.style = `overflow: auto`
    }, [])

    //유동인구 데이터 삭제하는 로직
    const handleDelete = (index) => {
        const updatedFloatingPopulations = [...floatingPopulations];
        updatedFloatingPopulations.splice(index, 1);
        alert('데이터가 삭제되었습니다.')
        setFloatingPopulations(updatedFloatingPopulations);
    };

    //유동인구 추가 팝업 여는 로직
    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };


    //유동인구 데이터 input창 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFloatingPopulationData({
            ...newFloatingPopulationData,
            [name]: value
        });
    };

    //유동인구 추가하는 로직
    const addFloatingPopulation = () => {
        const updatedFloatingPopulations = [...floatingPopulations, newFloatingPopulationData];
        setFloatingPopulations(updatedFloatingPopulations);
        // 데이터 업데이트하기
        saveFloatingPopulationData(updatedFloatingPopulations);
        // 팝업 닫기
        setIsPopupOpen(false);
        // 인풋창 리셋
        setNewFloatingPopulationData({
            measurementTime: '',
            autonomousDistrict: '',
            administrativeDistrict: '',
            numberOfVisitors: ''
        });
        // 결과보여주기
        alert('데이터가 추가되었습니다.');
    };

    //유동인구 저장하는 로직
    const saveFloatingPopulationData = (data) => {
        // 데이터를 json꼴로 바꿔줌
        const jsonData = JSON.stringify(data);

        //어디로 추가할것인지 적는 로직
        fetch('http://localhost:3000/MapData/floatingPopulation/Data.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to save data');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data saved successfully:', data);
            })
            .catch(error => {
                console.error('Error saving data:', error);
            });
    };

    return (
        <A.Container>
            <A.Box>
                <A.Title>유동인구 데이터 관리</A.Title>
                <A.FieldContainer>
                    <K.DateField>측정시간</K.DateField>
                    <K.UserNameField>자치구</K.UserNameField>
                    <K.TitleField>행정동</K.TitleField>
                    <S.ContentField>방문자수</S.ContentField>
                </A.FieldContainer>
                <A.MemberContainer>
                    {floatingPopulations.map((floatingPopulation, index) => (
                        <A.MemberItem>
                            <K.ReportDate>{floatingPopulation.measurementTime}</K.ReportDate>
                            <K.ReportName>{floatingPopulation.autonomousDistrict}</K.ReportName>
                            <K.ReportTitle>{floatingPopulation.administrativeDistrict}</K.ReportTitle>
                            <S.ReportContent>{floatingPopulation.numberOfVisitors}</S.ReportContent>
                            <button onClick={() => handleDelete(index)}>X</button>
                        </A.MemberItem>
                    ))}
                </A.MemberContainer>
                <Z.AddBox onClick={togglePopup}>유동인구 추가하기</Z.AddBox>

                {/* CCTV 데이터 추가 팝업 */}
                {isPopupOpen && (
                    <Modal
                        isOpen={isPopupOpen}
                        onRequestClose={() => setIsPopupOpen(false)}
                        style={customModalStyles}
                    >
                        <Z.Popup>
                            <Z.Title>유동인구 추가하기</Z.Title>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '40px' }}>
                                <Z.InputBox>
                                    <Z.SubTitle>
                                        측정시간
                                    </Z.SubTitle>
                                    <Z.Input type="text" name="measurementTime" placeholder="측정시간" value={newFloatingPopulationData.measurementTime} onChange={handleInputChange} />
                                    <Z.SubTitle>
                                        행정동
                                    </Z.SubTitle>
                                    <Z.Input type="text" name="autonomousDistrict" placeholder="행정동" value={newFloatingPopulationData.autonomousDistrict} onChange={handleInputChange} />
                                </Z.InputBox>
                                <Z.InputBox>
                                    <Z.SubTitle>
                                        자치구
                                    </Z.SubTitle>
                                    <Z.Input type="text" name="administrativeDistrict" placeholder="자치구" value={newFloatingPopulationData.administrativeDistrict} onChange={handleInputChange} />
                                    <Z.SubTitle>
                                        방문자수
                                    </Z.SubTitle>
                                    <Z.Input type="text" name="numberOfVisitors" placeholder="방문자수" value={newFloatingPopulationData.numberOfVisitors} onChange={handleInputChange} />
                                </Z.InputBox>
                            </div>
                            <Z.ButtonBox>
                                <Z.Button onClick={addFloatingPopulation}>추가</Z.Button>
                            </Z.ButtonBox>
                        </Z.Popup>
                    </Modal>
                )}
            </A.Box>
        </A.Container>
    );
}

const customModalStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        width: '100%',
        height: '100%',
        zIndex: '130',
        position: 'fixed',
        top: '0',
        left: '0',
        overflow: 'hidden'
    },
    content: {
        width: '40%',
        height: '40%',
        zIndex: '150',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '10px',
        boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.25)',
        backgroundColor: 'white',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '0px'
    },
};