import { Modal, Input } from "web3uikit"

interface UpdateList {
  nftAddress: string
  tokenId: string
  isVisible: boolean
  onClose: () => void
}

const UpdateLisingModal = ({
  nftAddress,
  tokenId,
  isVisible,
  onClose,
}: UpdateList) => {
  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
    >
      <Input label="Label text" name="Test text Input" type="number" />
    </Modal>
  )
}

export default UpdateLisingModal
