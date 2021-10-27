// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"time"
)

type Course struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Semester    int    `json:"semester"`
	Year        int    `json:"year"`
	PloGroupID  string `json:"ploGroupID"`
	ProgramID   string `json:"programID"`
}

type CreateCourseInput struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Semester    int    `json:"semester"`
	Year        int    `json:"year"`
	PloGroupID  string `json:"ploGroupID"`
}

type CreateLOInput struct {
	Title       string `json:"title"`
	Level       int    `json:"level"`
	Description string `json:"description"`
}

type CreateLOLevelInput struct {
	Level       int    `json:"level"`
	Description string `json:"description"`
}

type CreateLOLinkResult struct {
	LoID  string `json:"loID"`
	PloID string `json:"ploID"`
}

type CreateLOResult struct {
	ID string `json:"id"`
}

type CreateLOsInput struct {
	Title  string                `json:"title"`
	Levels []*CreateLOLevelInput `json:"levels"`
}

type CreatePLOInput struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type CreatePLOsInput struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type CreateProgramInput struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type CreateQuestionInput struct {
	Title    string                       `json:"title"`
	MaxScore int                          `json:"maxScore"`
	Results  []*CreateQuestionResultInput `json:"results"`
}

type CreateQuestionLinkInput struct {
	QuestionID string `json:"questionID"`
	LoID       string `json:"loID"`
	Level      int    `json:"level"`
}

type CreateQuestionLinkResult struct {
	QuestionID string `json:"questionID"`
	LoID       string `json:"loID"`
}

type CreateQuestionResultInput struct {
	StudentID string `json:"studentID"`
	Score     int    `json:"score"`
}

type CreateQuizInput struct {
	Name      string                 `json:"name"`
	CreatedAt time.Time              `json:"createdAt"`
	Questions []*CreateQuestionInput `json:"questions"`
}

type CreateQuizResult struct {
	ID string `json:"id"`
}

type CreateStudentInput struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Surname string `json:"surname"`
}

type CreateStudentResult struct {
	ID string `json:"id"`
}

type DeleteLOLevelResult struct {
	ID string `json:"id"`
}

type DeleteLOLinkResult struct {
	LoID  string `json:"loID"`
	PloID string `json:"ploID"`
}

type DeleteLOResult struct {
	ID string `json:"id"`
}

type DeleteQuestionLinkInput struct {
	QuestionID string `json:"questionID"`
	LoID       string `json:"loID"`
	Level      int    `json:"level"`
}

type DeleteQuestionLinkResult struct {
	QuestionID string `json:"questionID"`
	LoID       string `json:"loID"`
}

type DeleteQuizResult struct {
	ID string `json:"id"`
}

type Lo struct {
	ID       string     `json:"id"`
	Title    string     `json:"title"`
	Levels   []*LOLevel `json:"levels"`
	PloLinks []*Plo     `json:"ploLinks"`
}

type LOLevel struct {
	Level       int    `json:"level"`
	Description string `json:"description"`
}

type Plo struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	PloGroupID  string `json:"ploGroupID"`
}

type PLOGroup struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Program struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Question struct {
	ID       string            `json:"id"`
	Title    string            `json:"title"`
	MaxScore int               `json:"maxScore"`
	Results  []*QuestionResult `json:"results"`
	LoLinks  []*QuestionLink   `json:"loLinks"`
}

type QuestionLink struct {
	LoID        string `json:"loID"`
	Level       int    `json:"level"`
	Description string `json:"description"`
}

type QuestionResult struct {
	StudentID string `json:"studentID"`
	Score     int    `json:"score"`
}

type Quiz struct {
	ID        string      `json:"id"`
	Name      string      `json:"name"`
	CreatedAt time.Time   `json:"createdAt"`
	Questions []*Question `json:"questions"`
}

type User struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Surname string `json:"surname"`
}

type DeletePLOGroupResult struct {
	ID string `json:"id"`
}

type DeletePLOResult struct {
	ID string `json:"id"`
}