import React from 'react';
import { S1_Welcome } from './Welcome';
import { S2_Profile } from './Profile';
import { S3_Crop } from './CropSoil';
import { S4_Method } from './Method';
import { S4_Boundary } from './BoundaryMap';
import { S5_Confirm } from './Confirmation';
import { S5b_Success } from './Success';

export { S1_Welcome, S2_Profile, S3_Crop, S4_Method, S4_Boundary, S5_Confirm, S5b_Success };

export default function OnboardingScreens(props) {
    const { idx } = props;
    switch (idx) {
        case 0: return <S1_Welcome {...props} />;
        case 1: return <S2_Profile {...props} profile={props.farmerProfile} setProfile={props.setFarmerProfile} />;
        case 2: return <S3_Crop {...props} details={props.farmDetails} setDetails={props.setFarmDetails} />;
        case 3: return <S4_Method {...props} />;
        case 4: return <S4_Boundary {...props} details={props.farmDetails} setDetails={props.setFarmDetails} />;
        case 5: return <S5_Confirm {...props} profile={props.farmerProfile} details={props.farmDetails} farmerId={props.farmerId} />;
        case 6: return <S5b_Success {...props} />;
        default: return <S1_Welcome {...props} />;
    }
}
