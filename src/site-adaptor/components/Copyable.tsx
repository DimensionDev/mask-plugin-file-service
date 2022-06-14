interface Props {
    className?: string
}

export function CopyableCode({ children, className }: React.PropsWithChildren<Props>) {
    const onSelect = (event: React.MouseEvent<Node>) => {
        const selection = getSelection()
        if (selection === null) {
            return
        }
        const range = document.createRange()
        range.selectNode(event.currentTarget)
        selection.removeAllRanges()
        selection.addRange(range)
    }
    const onDeselect = () => {
        getSelection()?.removeAllRanges()
    }
    const onCopy = async (event: React.MouseEvent<HTMLElement>) => {
        onSelect(event)
    }
    return (
        <code
            className={className}
            onClick={onCopy}
            onMouseEnter={onSelect}
            onMouseLeave={onDeselect}
            children={children}
        />
    )
}
