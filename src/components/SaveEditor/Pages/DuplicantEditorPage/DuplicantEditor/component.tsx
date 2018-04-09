
import * as React from "react";

import {
    Tabs,
    Tab
} from "material-ui/Tabs";

import { autobind } from "core-decorators";

import { GameObject } from "oni-save-parser";

import {
    MinionIdentityBehavior,
    AttributeLevelBehavior,
    getBehavior
} from '../../../../../behaviors';


import DuplicantIdentityEditor from "../DuplicantIdentityEditor";
import DuplicantSkillsEditor from "../DuplicantSkillsEditor";
import DuplicantTraitEditor from "../DuplicantTraitEditor";

const EDITORS = {
    "identity": DuplicantIdentityEditor,
    "skills": DuplicantSkillsEditor,
    "traits": DuplicantTraitEditor
};

type EditorName = keyof typeof EDITORS;

export interface DuplicantEditorProps {
    minion: GameObject;
}

interface State {
    selectedTab: EditorName;
}

export default class DuplicantEditor extends React.Component<DuplicantEditorProps, State> {
    constructor(props: DuplicantEditorProps) {
        super(props);
        this.state = {
            selectedTab: "identity"
        };
    }

    render() {
        const {
            minion
        } = this.props;

        const {
            selectedTab
        } = this.state;

        const identBehavior = getBehavior(minion, MinionIdentityBehavior);
        if (!identBehavior) {
            return <div>Error: No MinionIdentity behavior found for dup.</div>;
        }

        const tabs: React.ReactFragment[] = [];
        for(let key of Object.keys(EDITORS)) {
            tabs.push(
                <Tab key={key} label={key} value={key}/>
            );
        }

        const SelectedComponent = EDITORS[selectedTab];

        return (
            <div className="fill-parent layout-vertical">
                <span className="layout-item">Name: {identBehavior.parsedData.name}</span>
                <Tabs className="layout-item" value={selectedTab} onChange={this._onTabChange}>
                    {tabs}
                </Tabs>
                {/* 
                    Select the component based on the selected tab.
                    This is a workaround to the tab container breaking our scroll decisions by
                    providing infinite space.
                */}
                <div className="layout-item-fill scrolling-content">
                    <SelectedComponent minion={minion}/>
                </div>
            </div>
        );
    }

    @autobind()
    private _onTabChange(value: string) {
        this.setState(s => ({
            ...s,
            selectedTab: value as EditorName
        }));
    }
}