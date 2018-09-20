class Api::V1::UsersController < ApplicationController
  def show
    render json: user
  end

  def create
    @user = User.new(user_params)

    if @user.save
      render json: @user, status: 201
    else
      render json: @user.errors, status: 422
    end
  end

  def update
    if user.update_attributes(user_params)
      render json: user
    else
      render json: user.errors, status: 422
    end
  end

  def destroy
    user.destroy

    render json: user
  end

  private
  def user
    @user ||= User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:name, :email)
  end
end
