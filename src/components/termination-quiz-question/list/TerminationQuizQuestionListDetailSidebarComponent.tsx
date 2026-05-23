import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DetailSidebarComponent, TerminationQuizQuestionDetailComponent } from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION_EDIT } from '@/constant'
import { mapperTerminationQuizQuestionDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreTerminationQuizQuestion } from '@/store'

interface TerminationQuizQuestionListDetailSidebarComponentProps {
  rowId: string | null
  onClose: () => void
}

export function TerminationQuizQuestionListDetailSidebarComponent(props: TerminationQuizQuestionListDetailSidebarComponentProps) {
  const { rowId, onClose } = props
  const navigate = useNavigate()
  const detail = useStoreTerminationQuizQuestion((s) => s.terminationQuizQuestionDetail)
  const loading = useStoreTerminationQuizQuestion((s) => s.operationLoading.detail)
  const error = useStoreTerminationQuizQuestion((s) => s.operationStatus.detail.error)
  const getTerminationQuizQuestionDetail = useStoreTerminationQuizQuestion((s) => s.getTerminationQuizQuestionDetail)
  const clearTerminationQuizQuestionDetail = useStoreTerminationQuizQuestion((s) => s.clearTerminationQuizQuestionDetail)

  useEffect(() => {
    if (rowId) void getTerminationQuizQuestionDetail(rowId)
  }, [getTerminationQuizQuestionDetail, rowId])

  const handleClose = () => {
    clearTerminationQuizQuestionDetail()
    onClose()
  }

  const detailView = mapperTerminationQuizQuestionDetailView(detail)
  const title = detailView
    ? 'Detalle de pregunta'
    : messages.terminationQuizQuestion.ui.detailTitleFallback

  return (
    <DetailSidebarComponent open={rowId !== null} title={title} onClose={handleClose}>
      <TerminationQuizQuestionDetailComponent
        key={rowId ?? 'empty-tqq-detail'}
        detail={detailView}
        loading={loading}
        errorMessage={error}
        onRetry={() => { if (rowId) void getTerminationQuizQuestionDetail(rowId) }}
        onEdit={rowId ? () => navigate(`${AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION_EDIT}=${rowId}`) : undefined}
      />
    </DetailSidebarComponent>
  )
}
