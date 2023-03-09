import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { Modal, ModalVariant, Form, FormGroup, ActionGroup, Button } from '@patternfly/react-core';
import { addCVFilterRule, editCVFilterRule, getCVFilterRules } from '../../../ContentViewDetailActions';
import { orgId } from '../../../../../../services/api';
import SearchText from '../../../../../../components/Search/SearchText';

const AddEditContainerTagRuleModal = ({
  onClose, filterId, selectedFilterRuleData, repositoryIds,
}) => {
  const { name, id } = selectedFilterRuleData;
  const dispatch = useDispatch();
  const [tagName, setTagName] = useState(name);
  const [saving, setSaving] = useState(false);
  const isEditing = name && id;

  const autoCompleteEndpoint = '/katello/api/v2/docker_tags/auto_complete_name';

  const onSubmit = () => {
    setSaving(true);
    if (isEditing) {
      dispatch(editCVFilterRule(
        filterId,
        { id, name: tagName },
        () => dispatch(getCVFilterRules(filterId)),
      ));
    } else {
      dispatch(addCVFilterRule(
        filterId,
        { name: tagName },
        () => dispatch(getCVFilterRules(filterId)),
      ));
    }
    onClose();
  };

  const searchDataProp = term => ({
    organization_id: orgId(),
    term,
    repoids: repositoryIds,
  });

  return (
    <Modal
      title={isEditing ? __('Edit filter rule') : __('Add filter rule')}
      variant={ModalVariant.small}
      isOpen
      onClose={onClose}
      appendTo={document.body}
    >
      <Form onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      >
        <FormGroup label={__('Tag name')} isRequired fieldId="tag_name">
          <SearchText
            data={{
              autocomplete: {
                url: autoCompleteEndpoint,
                apiParams: tag => searchDataProp(tag),
              },
            }}
            onSearchChange={setTagName}
          />
        </FormGroup>
        <ActionGroup>
          <Button
            ouiaId="add-edit-container-tag-filter-rule-submit"
            aria-label="add_edit_filter_rule"
            variant="primary"
            isDisabled={saving || tagName.length === 0}
            type="submit"
          >
            {isEditing ? __('Edit rule') : __('Add rule')}
          </Button>
          <Button ouiaId="add-edit-container-tag-filter-rule-cancel" variant="link" onClick={onClose}>
            {__('Cancel')}
          </Button>
        </ActionGroup>
      </Form >
    </Modal >
  );
};

AddEditContainerTagRuleModal.propTypes = {
  filterId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClose: PropTypes.func.isRequired,
  selectedFilterRuleData: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
  }),
  repositoryIds: PropTypes.arrayOf(PropTypes.number),
};

AddEditContainerTagRuleModal.defaultProps = {
  selectedFilterRuleData: { name: '', id: undefined },
  repositoryIds: [],
};

export default AddEditContainerTagRuleModal;
