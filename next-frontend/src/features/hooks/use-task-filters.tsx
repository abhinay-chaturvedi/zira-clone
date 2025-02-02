import { parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs'
import { TaskStatus } from '../tasks/types'

const useTaskFilters = () => {
    return useQueryStates({
        projectId: parseAsString,
        status: parseAsStringEnum(Object.values(TaskStatus)),
        assigneeId: parseAsString,
        search: parseAsString,
        dueDate: parseAsString
    })
}

export default useTaskFilters